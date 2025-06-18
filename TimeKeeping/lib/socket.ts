import { io } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

const socket = io(SOCKET_URL)

// Log connection status
socket.on('connect', () => {
    console.log('Socket connected successfully')
})

socket.on('disconnect', () => {
    console.log('Socket disconnected')
})

socket.on('error', (error) => {
    console.error('Socket error:', error)
})

// // Log all incoming events for debugging
// socket.onAny((eventName, ...args) => {
//   console.log('Received event:', eventName, args)
// })

export default socket
