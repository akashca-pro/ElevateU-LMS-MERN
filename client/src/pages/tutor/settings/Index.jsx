import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Wallet, SettingsIcon, Edit } from "lucide-react"

import UpdateEmailForm from '@/components/settings/UpdateEmailForm'
import UpdatePasswordForm from "@/components/settings/UpdatePasswordForm"
import DeleteAccount from "@/components/settings/DeleteAccount"
import BankDetailsForm from "@/components/settings/BankDetailsForm"
import ThemeToggle from "@/components/settings/ThemeToggle"

import { Button } from "@/components/ui/button"
import { useState } from "react"

import { useTutorUpdateEmailMutation, useTutorVerifyEmailMutation,
  useTutorUpdatePasswordMutation, useTutorVerifyOtpForPasswordMutation,
  useTutorResendOtpForPasswordChangeMutation,
  useTutorDeactivateAccountMutation
 } from 
'@/services/TutorApi/tutorProfileApi.js'
import WorkInProgress from "@/components/FallbackUI/WorkInProgress"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
}

export default function Index() {
  const [enableEdit,setEnableEdit] = useState(true);
  const [updateEmail] = useTutorUpdateEmailMutation()
  const [verifyEmail] = useTutorVerifyEmailMutation()

  const [updatePassword] = useTutorUpdatePasswordMutation();
  const [verifyPassword] = useTutorVerifyOtpForPasswordMutation();
  const [resendOtpForPass] = useTutorResendOtpForPasswordChangeMutation()

  const [deactivateAccount] = useTutorDeactivateAccountMutation()

  return (
    <div className="container max-w-4xl py-10 mx-auto">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span>Bank</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>Update your email address associated with your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpdateEmailForm updateEmail={updateEmail} verifyEmail={verifyEmail} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpdatePasswordForm updatePassword={updatePassword} 
                  verifyPassword={verifyPassword}
                  resendOtpForPass={resendOtpForPass}/>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deactivate Account</CardTitle>
                  <CardDescription>Deactivate your account and all associated data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DeleteAccount deactivateAccount={deactivateAccount} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bank" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Update your bank account information for payments and withdrawals.</CardDescription>
                </div>
                <Button size="icon" onClick={()=>setEnableEdit(false)} disabled={!enableEdit} variant={'outline'}  >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent>
                <BankDetailsForm isEdit = {enableEdit} setIsEdit={setEnableEdit} />
              </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the appearance of the application.</CardDescription>
                </CardHeader>
                <CardContent>
                  <WorkInProgress title={'Work in progress'}>
                  <ThemeToggle />
                  </WorkInProgress>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

