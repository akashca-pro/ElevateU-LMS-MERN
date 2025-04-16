import { useState, useEffect } from "react"

// Mock data for certificates
const mockCertificates = [
  {
    id: "cert-1234-5678-abcd",
    courseName: "Complete Web Development Bootcamp",
    tutorName: "Sarah Johnson",
    completionDate: "2023-11-15T12:00:00Z",
    difficulty: "Intermediate",
    duration: 42,
    skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
  },
  {
    id: "cert-2345-6789-bcde",
    courseName: "Advanced JavaScript Masterclass",
    tutorName: "Michael Chen",
    completionDate: "2023-12-05T12:00:00Z",
    difficulty: "Advanced",
    duration: 28,
    skills: ["JavaScript", "ES6+", "Async/Await", "Design Patterns"],
  },
  {
    id: "cert-3456-7890-cdef",
    courseName: "UI/UX Design Fundamentals",
    tutorName: "Emily Davis",
    completionDate: "2023-10-20T12:00:00Z",
    difficulty: "Beginner",
    duration: 35,
    skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
  },
  {
    id: "cert-4567-8901-defg",
    courseName: "Data Science with Python",
    tutorName: "David Wilson",
    completionDate: "2023-09-10T12:00:00Z",
    difficulty: "Intermediate",
    duration: 48,
    skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Machine Learning"],
  },
  {
    id: "cert-5678-9012-efgh",
    courseName: "Mobile App Development with React Native",
    tutorName: "Jessica Taylor",
    completionDate: "2023-08-25T12:00:00Z",
    difficulty: "Intermediate",
    duration: 32,
    skills: ["React Native", "JavaScript", "Mobile UI", "API Integration"],
  },
  {
    id: "cert-6789-0123-fghi",
    courseName: "DevOps Engineering Essentials",
    tutorName: "Robert Brown",
    completionDate: "2023-07-15T12:00:00Z",
    difficulty: "Advanced",
    duration: 40,
    skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"],
  },
]

export const useCertificates = () => {
  const [certificates, setCertificates] = useState([])
  const [recentCertificates, setRecentCertificates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate API call
    const fetchCertificates = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Sort certificates by completion date (newest first)
        const sortedCertificates = [...mockCertificates].sort(
          (a, b) => new Date(b.completionDate) - new Date(a.completionDate),
        )

        setCertificates(sortedCertificates)

        // Get certificates from the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recent = sortedCertificates.filter((cert) => new Date(cert.completionDate) >= thirtyDaysAgo)

        setRecentCertificates(recent)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching certificates:", err)
        setError(err)
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  return {
    certificates,
    recentCertificates,
    isLoading,
    error,
  }
}
