import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, SettingsIcon } from "lucide-react"

import UpdateEmailForm from '@/components/settings/UpdateEmailForm'
import UpdatePasswordForm from "@/components/settings/UpdatePasswordForm"
import DeleteAccount from "@/components/settings/DeleteAccount"
import ThemeToggle from "@/components/settings/ThemeToggle"

import { useUserUpdateEmailMutation, useUserVerifyEmailMutation,
useUserUpdatePasswordMutation, useUserVerifyOtpForPasswordMutation,
useUserResendOtpForPasswordChangeMutation
 } from 
'@/services/userApi/userProfileApi.js'


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
  const [updateEmail] = useUserUpdateEmailMutation();
  const [verifyEmail] = useUserVerifyEmailMutation();

  const [updatePassword] = useUserUpdatePasswordMutation();
  const [verifyPassword] = useUserVerifyOtpForPasswordMutation();
  const [resendOtpForPass] = useUserResendOtpForPasswordChangeMutation()

  return (
    <div className="container max-w-4xl py-10 mx-auto">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Account</span>
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
                  <UpdateEmailForm updateEmail={updateEmail} 
                  verifyEmail={verifyEmail} />
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
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DeleteAccount />
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
                  <ThemeToggle />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

