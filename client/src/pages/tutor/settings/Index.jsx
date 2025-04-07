import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Wallet, SettingsIcon, Edit } from "lucide-react"

import UpdateEmailForm from "./components/UpdateEmailForm"
import UpdatePasswordForm from "./components/UpdatePasswordForm"
import DeleteAccount from "./components/DeleteAccount"
import BankDetailsForm from "./components/BankDetailsForm"
import ThemeToggle from "./components/ThemeToggle"
import { Button } from "@/components/ui/button"

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
                  <UpdateEmailForm />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent>
                  <UpdatePasswordForm />
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

            <TabsContent value="bank" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>Update your bank account information for payments and withdrawals.</CardDescription>
                </div>
                <Button size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent>
                <BankDetailsForm />
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

