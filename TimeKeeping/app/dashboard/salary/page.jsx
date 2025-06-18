// /**
//  * Trang quản lý lương
//  * Bao gồm các tab: Chấm công, Lương thưởng, Hệ số lương
//  */
// "use client"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { AttendanceManagement } from "@/components/salary/attendance-management"
// import { SalaryBonus } from "@/components/salary/salary-bonus"
// import { SalaryCoefficients } from "@/components/salary/salary-coefficients"

// /**
//  * Component trang quản lý lương
//  * Sử dụng tabs để chuyển đổi giữa các chức năng quản lý lương
//  */
// export default function SalaryPage() {
//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Quản Lý Lương</h1>

//       <Tabs defaultValue="attendance" className="space-y-4">
//         {/* Tabs điều hướng giữa các chức năng */}
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="attendance">Chấm Công</TabsTrigger>
//           <TabsTrigger value="salary">Lương Thưởng</TabsTrigger>
//           <TabsTrigger value="coefficients">Hệ Số Lương</TabsTrigger>
//         </TabsList>

//         {/* Nội dung tab Chấm Công */}
//         <TabsContent value="attendance">
//           <AttendanceManagement />
//         </TabsContent>

//         {/* Nội dung tab Lương Thưởng */}
//         <TabsContent value="salary">
//           <SalaryBonus />
//         </TabsContent>

//         {/* Nội dung tab Hệ Số Lương */}
//         <TabsContent value="coefficients">
//           <SalaryCoefficients />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
