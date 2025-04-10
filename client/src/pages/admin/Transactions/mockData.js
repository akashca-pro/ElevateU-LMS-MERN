// Generate random transaction IDs
const generateTransactionId = () => {
    return `TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  }
  
  // Generate random order IDs
  const generateOrderId = () => {
    return `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  }
  
  // Generate random Razorpay IDs
  const generateRazorpayId = () => {
    return `pay_${Math.random().toString(36).substring(2, 17)}`
  }
  
  // Mock users data
  const mockUsers = [
    {
      id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      profileImage: "/placeholder.svg?height=100&width=100&text=JD",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      additionalInfo: "Premium member since 2021",
    },
    {
      id: "user2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      profileImage: "/placeholder.svg?height=100&width=100&text=JS",
      phone: "+1 (555) 987-6543",
      location: "San Francisco, USA",
      additionalInfo: "Course instructor with 15+ courses",
    },
    {
      id: "user3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      profileImage: "/placeholder.svg?height=100&width=100&text=RJ",
      phone: "+1 (555) 456-7890",
      location: "Chicago, USA",
    },
    {
      id: "user4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      profileImage: "/placeholder.svg?height=100&width=100&text=ED",
      phone: "+1 (555) 234-5678",
      location: "Austin, USA",
      additionalInfo: "Top-rated instructor",
    },
    {
      id: "user5",
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      profileImage: "/placeholder.svg?height=100&width=100&text=MW",
      phone: "+1 (555) 876-5432",
      location: "Seattle, USA",
    },
  ]
  
  // Mock courses data
  const mockCourses = [
    {
      id: "course1",
      name: "Complete Web Development Bootcamp",
      description: "Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.",
      thumbnail: "/placeholder.svg?height=400&width=600&text=Web+Development",
      price: 99.99,
      originalPrice: 199.99,
      category: "Web Development",
      level: "Beginner",
      duration: 42,
      lessons: 148,
      totalEnrollment: 15243,
      createdAt: "Jan 2023",
    },
    {
      id: "course2",
      name: "Advanced JavaScript Masterclass",
      description: "Take your JavaScript skills to the next level with advanced concepts and patterns.",
      thumbnail: "/placeholder.svg?height=400&width=600&text=JavaScript",
      price: 79.99,
      originalPrice: 129.99,
      category: "Programming",
      level: "Advanced",
      duration: 28,
      lessons: 86,
      totalEnrollment: 8765,
      createdAt: "Mar 2023",
    },
    {
      id: "course3",
      name: "UI/UX Design Fundamentals",
      description: "Learn the principles of user interface and user experience design.",
      thumbnail: "/placeholder.svg?height=400&width=600&text=UI/UX+Design",
      price: 89.99,
      originalPrice: 149.99,
      category: "Design",
      level: "Intermediate",
      duration: 35,
      lessons: 92,
      totalEnrollment: 6432,
      createdAt: "Apr 2023",
    },
    {
      id: "course4",
      name: "Data Science with Python",
      description: "Master data analysis, visualization, and machine learning with Python.",
      thumbnail: "/placeholder.svg?height=400&width=600&text=Data+Science",
      price: 119.99,
      originalPrice: 199.99,
      category: "Data Science",
      level: "Intermediate",
      duration: 48,
      lessons: 156,
      totalEnrollment: 9876,
      createdAt: "Feb 2023",
    },
    {
      id: "course5",
      name: "Mobile App Development with React Native",
      description: "Build cross-platform mobile apps for iOS and Android using React Native.",
      thumbnail: "/placeholder.svg?height=400&width=600&text=React+Native",
      price: 89.99,
      originalPrice: 149.99,
      category: "Mobile Development", 
      level: "Intermediate",
      duration: 32,
      lessons: 104, // modules
      totalEnrollment: 7654,
      createdAt: "May 2023",
    },
  ]
  
  // Generate mock transactions
  export const mockTransactions = Array.from({ length: 50 }, (_, i) => {
    const isRefund = Math.random() < 0.2
    const isPayout = !isRefund && Math.random() < 0.3
    const type = isRefund ? "refund" : isPayout ? "payout" : "purchase"
  
    const courseIndex = Math.floor(Math.random() * mockCourses.length)
    const course = mockCourses[courseIndex]
  
    const buyerIndex = Math.floor(Math.random() * mockUsers.length)
    const sellerIndex = (buyerIndex + 1) % mockUsers.length
  
    const hasCoupon = Math.random() < 0.4
    const discountPercentage = hasCoupon ? Math.floor(Math.random() * 40) + 10 : 0
    const finalPrice = hasCoupon ? course.price * (1 - discountPercentage / 100) : course.price
  
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 60))
  
    return {
      id: generateTransactionId(),
      date: date.toISOString(),
      amount: isRefund ? -finalPrice : finalPrice,
      type,
      status: Math.random() < 0.8 ? "completed" : Math.random() < 0.5 ? "pending" : "failed",
      users: type === "payout" ? [mockUsers[sellerIndex]] : [mockUsers[buyerIndex], mockUsers[sellerIndex]],
      course,
      order: {
        orderId: generateOrderId(),
        d: generateRazorpayId(),
        date: date.toISOString(),
        paymentMethod: Math.random() < 0.7 ? "Credit Card" : "PayPal",
        originalPrice: course.price,
        finalPrice,
        couponApplied: hasCoupon,
        couponCode: hasCoupon ? `SAVE${discountPercentage}` : null,
        discountPercentage,
        status: Math.random() < 0.8 ? "completed" : Math.random() < 0.5 ? "pending" : "failed",
      },
    }
  })
  