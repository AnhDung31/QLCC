const mqtt = require('mqtt');
const config = require('../config/mqtt.config');
const employeeController = require('../controllers/employee.controller'); // Import employeeController
const employeeService = require('../services/employee.service'); // Import employeeService
const { parse } = require('date-fns');

class MQTTService {
  constructor(io) {
    this.io = io; // Socket.IO instance
    this.client = null;
  }

  connect() {
    const options = {
      keepalive: config.mqtt.keepalive,
      ...(process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD && {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD
      })
    };

    this.client = mqtt.connect(config.mqtt.url, options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.subscribe();
    });

    this.client.on('message', (topic, message) => {
      // console.log("topic : ", topic, " messages : ", message);
      this.handleMessage(topic, message)
    });
    this.client.on('error', (error) => this.handleError(error));
  }

  subscribe() {
    this.client.subscribe(config.mqtt.topic, (err) => {
      if (err) {
        console.error('MQTT subscription error:', err);
      } else {
        console.log('Subscribed to MQTT topic:', config.mqtt.topic);
      }
    });
  }

  async handleMessage(topic, message) {
    try {
      const messageString = message.toString();
      const eventData = JSON.parse(messageString);
      const { cmd } = eventData;

      if (!cmd) {
        console.error('Missing cmd in message:', eventData);
        return;
      }

      if (cmd === 'log') {
        // Checkin
        const processedData = {
          data: {
            deviceId: eventData.deviceId,
            employeeId: eventData.employeeId,
            employeeName: eventData.employeeName,
            timestamp: eventData.timestamp,
            faceBase64: eventData.faceBase64,
            status: 'checkin',
          }
        };
        await employeeController.handleCheckinSave(processedData);
          
        return;
      }

      if (cmd === 'add_employee') {
        // Thêm hoặc cập nhật nhân viên
        const registrationData = {
          employeeId: eventData.employeeId,
          employeeName: eventData.employeeName,
          deviceId: eventData.deviceId,
          faceEmbedding: eventData.faceEmbedding,
          faceBase64: eventData.faceBase64,
          registrationDate: eventData.timestamp,
        };
        // Kiểm tra nếu đã tồn tại thì cập nhật, chưa có thì thêm mới
        const existing = await employeeController.getEmployeeById({ params: { employeeId: eventData.employeeId } }, { json: () => {} });
        if (existing && existing.data) {
          // Cập nhật
          await employeeController.handleUpdateSave({
            employeeId: eventData.employeeId,
            fullName: eventData.employeeName,
            faceEmbedding: eventData.faceEmbedding,
            faceBase64: eventData.faceBase64,
          });
        } else {
          // Thêm mới
          await employeeController.handleRegistrationSave(registrationData);
        }
        return;
      }

      if (cmd === 'delete_employee') {
        // Xóa nhân viên
        await employeeController.deleteEmployee({ params: { employeeId: eventData.employeeId }, user: { role: 'superadmin' } }, { json: () => {} });
        return;
      }

      console.error('Unknown cmd:', cmd);
    } catch (error) {
      console.error('MQTT Service - Error processing message (parsing or initial processing):', error);
    }
  }

  handleError(error) {
    console.error('MQTT Client Error:', error);
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

module.exports = MQTTService; 