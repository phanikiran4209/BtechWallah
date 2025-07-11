export const mockData = {
  clients: [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1-555-0123",
      company: "Tech Solutions Inc",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@designco.com",
      phone: "+1-555-0456",
      company: "Design Co",
      joinDate: "2024-02-10"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@startup.io",
      phone: "+1-555-0789",
      company: "Startup Inc",
      joinDate: "2024-03-05"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@marketing.com",
      phone: "+1-555-0321",
      company: "Marketing Pro",
      joinDate: "2024-03-20"
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@fintech.com",
      phone: "+1-555-0654",
      company: "FinTech Solutions",
      joinDate: "2024-04-01"
    }
  ],
  projects: [
    {
      id: 1,
      name: "E-commerce Website",
      client: "John Smith",
      budget: 15000,
      startDate: "2024-01-20",
      endDate: "2024-03-15",
      status: "completed",
      description: "Full e-commerce platform with payment integration"
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "Sarah Johnson",
      budget: 25000,
      startDate: "2024-02-15",
      endDate: "2024-05-30",
      status: "active",
      description: "Cross-platform mobile app for design portfolio"
    },
    {
      id: 3,
      name: "Brand Identity Design",
      client: "Mike Chen",
      budget: 8000,
      startDate: "2024-03-10",
      endDate: "2024-04-15",
      status: "active",
      description: "Complete brand identity package including logo and guidelines"
    },
    {
      id: 4,
      name: "SEO Optimization",
      client: "Emily Davis",
      budget: 5000,
      startDate: "2024-03-25",
      endDate: "2024-06-25",
      status: "active",
      description: "Complete SEO audit and optimization strategy"
    },
    {
      id: 5,
      name: "Financial Dashboard",
      client: "David Wilson",
      budget: 18000,
      startDate: "2024-04-05",
      endDate: "2024-07-20",
      status: "on-hold",
      description: "Financial analytics dashboard for investment tracking"
    }
  ],
  invoices: [
    {
      id: 1,
      invoiceNumber: "INV-001",
      client: "John Smith",
      project: "E-commerce Website",
      amount: 15000,
      dueDate: "2024-03-30",
      createdDate: "2024-03-15",
      status: "paid",
      description: "Final payment for e-commerce website development"
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      client: "Sarah Johnson",
      project: "Mobile App Development",
      amount: 12500,
      dueDate: "2024-04-15",
      createdDate: "2024-03-15",
      status: "paid",
      description: "50% milestone payment for mobile app development"
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      client: "Mike Chen",
      project: "Brand Identity Design",
      amount: 4000,
      dueDate: "2024-04-10",
      createdDate: "2024-03-25",
      status: "pending",
      description: "Initial payment for brand identity design"
    },
    {
      id: 4,
      invoiceNumber: "INV-004",
      client: "Emily Davis",
      project: "SEO Optimization",
      amount: 2500,
      dueDate: "2024-04-20",
      createdDate: "2024-04-05",
      status: "pending",
      description: "Monthly SEO optimization retainer"
    },
    {
      id: 5,
      invoiceNumber: "INV-005",
      client: "David Wilson",
      project: "Financial Dashboard",
      amount: 9000,
      dueDate: "2024-05-01",
      createdDate: "2024-04-15",
      status: "overdue",
      description: "50% milestone payment for financial dashboard"
    }
  ]
};