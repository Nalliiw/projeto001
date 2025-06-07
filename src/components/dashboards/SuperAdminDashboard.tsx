import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Users,
  UserCheck,
  Activity,
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  Trophy,
  Workflow,
  Menu,
  X,
  Clock,
  UserPlus,
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/auth/ThemeToggle";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for charts
const patientGrowthData = [
  { month: "Jan", patients: 1200 },
  { month: "Fev", patients: 1350 },
  { month: "Mar", patients: 1480 },
  { month: "Abr", patients: 1620 },
  { month: "Mai", patients: 1750 },
  { month: "Jun", patients: 1890 },
];

const clinicActivityData = [
  { clinic: "Clínica A", activity: 85 },
  { clinic: "Clínica B", activity: 72 },
  { clinic: "Clínica C", activity: 91 },
  { clinic: "Clínica D", activity: 68 },
  { clinic: "Clínica E", activity: 79 },
];

// Mock recent activities
const recentActivities = [
  {
    id: 1,
    icon: UserPlus,
    description: "Clínica São Paulo cadastrou um novo especialista",
    time: "2 horas atrás",
  },
  {
    id: 2,
    icon: Trophy,
    description: "Paciente Maria completou o fluxo 'Ansiedade'",
    time: "4 horas atrás",
  },
  {
    id: 3,
    icon: FileText,
    description: "Novo questionário 'Depressão' foi publicado",
    time: "6 horas atrás",
  },
  {
    id: 4,
    icon: Building2,
    description: "Clínica Rio de Janeiro foi aprovada no sistema",
    time: "1 dia atrás",
  },
  {
    id: 5,
    icon: Users,
    description: "15 novos pacientes registrados hoje",
    time: "2 dias atrás",
  },
];

// Mock clinic data
const mockClinics = [
  {
    id: 1,
    name: "Clínica São Paulo",
    cnpj: "12.345.678/0001-90",
    email: "contato@clinicasp.com.br",
    phone: "(11) 99999-9999",
    city: "São Paulo",
    state: "SP",
    address: "Rua das Flores, 123 - Centro",
    status: "active",
    logo: null,
  },
  {
    id: 2,
    name: "Clínica Rio de Janeiro",
    cnpj: "98.765.432/0001-10",
    email: "contato@clinicarj.com.br",
    phone: "(21) 88888-8888",
    city: "Rio de Janeiro",
    state: "RJ",
    address: "Av. Copacabana, 456 - Copacabana",
    status: "active",
    logo: null,
  },
  {
    id: 3,
    name: "Clínica Belo Horizonte",
    cnpj: "11.222.333/0001-44",
    email: "contato@clinicabh.com.br",
    phone: "(31) 77777-7777",
    city: "Belo Horizonte",
    state: "MG",
    address: "Rua da Saúde, 789 - Centro",
    status: "inactive",
    logo: null,
  },
  {
    id: 4,
    name: "Clínica Salvador",
    cnpj: "55.666.777/0001-88",
    email: "contato@clinicassa.com.br",
    phone: "(71) 66666-6666",
    city: "Salvador",
    state: "BA",
    address: "Av. Oceânica, 321 - Barra",
    status: "active",
    logo: null,
  },
  {
    id: 5,
    name: "Clínica Porto Alegre",
    cnpj: "99.888.777/0001-66",
    email: "contato@clinicapoa.com.br",
    phone: "(51) 55555-5555",
    city: "Porto Alegre",
    state: "RS",
    address: "Rua dos Andradas, 654 - Centro Histórico",
    status: "active",
    logo: null,
  },
];

interface Clinic {
  id: number;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  status: "active" | "inactive";
  logo: string | null;
}

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "clinics" | "settings" | "profile"
  >("dashboard");
  const [clinics, setClinics] = useState<Clinic[]>(mockClinics);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    logo: null as File | null,
  });

  // Visual Identity Settings State
  const [visualIdentity, setVisualIdentity] = useState({
    mainLogo: null as File | null,
    mobileLogo: null as File | null,
    favicon: null as File | null,
    primaryColor: "#10B981",
    mainLogoPreview: "",
    mobileLogoPreview: "",
    faviconPreview: "",
  });

  // System Information Settings State
  const [systemInfo, setSystemInfo] = useState({
    version: "v1.3.0",
    baseUrl: "https://app.clinicsys.com",
    termsUrl: "https://clinicsys.com/termos",
    maintenanceMode: false,
  });

  // Global Preferences Settings State
  const [globalPreferences, setGlobalPreferences] = useState({
    defaultTheme: "light",
    defaultLanguage: "pt-BR",
    pushNotifications: true,
    autoActivateClinics: false,
    individualBranding: true,
  });

  const itemsPerPage = 5;

  // Filter clinics based on search and status
  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || clinic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginate filtered clinics
  const totalPages = Math.ceil(filteredClinics.length / itemsPerPage);
  const paginatedClinics = filteredClinics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCreateClinic = () => {
    const newClinic: Clinic = {
      id: Math.max(...clinics.map((c) => c.id)) + 1,
      name: formData.name,
      cnpj: formData.cnpj,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      status: "active",
      logo: null,
    };
    setClinics([...clinics, newClinic]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditClinic = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData({
      name: clinic.name,
      cnpj: clinic.cnpj,
      email: clinic.email,
      phone: clinic.phone,
      city: clinic.city,
      state: clinic.state,
      address: clinic.address,
      logo: null,
    });
  };

  const handleUpdateClinic = () => {
    if (!editingClinic) return;

    const updatedClinics = clinics.map((clinic) =>
      clinic.id === editingClinic.id
        ? {
            ...clinic,
            name: formData.name,
            cnpj: formData.cnpj,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            state: formData.state,
            address: formData.address,
          }
        : clinic,
    );
    setClinics(updatedClinics);
    setEditingClinic(null);
    resetForm();
  };

  const handleDeactivateClinic = (clinicId: number) => {
    const updatedClinics = clinics.map((clinic) =>
      clinic.id === clinicId
        ? {
            ...clinic,
            status:
              clinic.status === "active"
                ? "inactive"
                : ("active" as "active" | "inactive"),
          }
        : clinic,
    );
    setClinics(updatedClinics);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cnpj: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      address: "",
      logo: null,
    });
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" as const },
    { icon: Building2, label: "Clínicas", view: "clinics" as const },
  ];

  const stats = [
    {
      title: "Total de Clínicas Ativas",
      value: "12",
      change: "+2 este mês",
      icon: Building2,
    },
    {
      title: "Total de Especialistas Registrados",
      value: "248",
      change: "+12 esta semana",
      icon: UserCheck,
    },
    {
      title: "Total de Pacientes no Sistema",
      value: "1,890",
      change: "+140 este mês",
      icon: Users,
    },
    {
      title: "Usuários Ativos Hoje",
      value: "89",
      change: "+15 desde ontem",
      icon: Activity,
    },
  ];

  // Import ProfilePage component at the top
  const ProfilePage = React.lazy(() => import("../ProfilePage"));

  if (currentView === "profile") {
    return (
      <React.Suspense fallback={<div>Carregando...</div>}>
        <ProfilePage onBack={() => setCurrentView("dashboard")} />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Sidebar - Hidden on mobile */}
      <div
        className={`sidebar-fixed bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-foreground))] shadow-xl border-r border-border/50 backdrop-blur-md bg-opacity-80 hidden lg:flex lg:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[hsl(var(--sidebar-muted))]">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-primary" />
            {!sidebarCollapsed && (
              <span className="ml-2 text-lg font-semibold text-[hsl(var(--sidebar-foreground))]">
                ClinicSys
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="mt-6 px-3 flex-1 overflow-y-auto pb-16">
          {/* Added padding at bottom to prevent overlap with fixed logout button */}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={index}
                onClick={() => item.view && setCurrentView(item.view)}
                className={`w-full flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-accent-foreground))]"
                    : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-muted))]"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
                {!sidebarCollapsed && item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[hsl(var(--sidebar-muted))] mt-auto sticky bottom-0 bg-[hsl(var(--sidebar-bg))] backdrop-blur-md bg-opacity-80 space-y-3">
          <div className="flex items-center justify-end mb-2">
            <ThemeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-muted))] ${
                  sidebarCollapsed ? "justify-center px-0" : "justify-start"
                }`}
                title={sidebarCollapsed ? user?.name : undefined}
              >
                <User className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
                {!sidebarCollapsed && "Conta"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setCurrentView("profile")}>
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView("settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3 mt-3 pt-3 border-t border-[hsl(var(--sidebar-muted))]">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-xs text-[hsl(var(--sidebar-foreground))] opacity-70 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}
      >
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto dashboard-mobile-content p-4 sm:p-5 lg:p-6 pt-4 lg:pt-6 pb-24 lg:pb-6">
          {currentView === "dashboard" ? (
            <>
              {/* Admin Stats */}
              <div className="grid mobile-grid-compact sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="supabase-card stats-card-mobile"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium mobile-text-compact">
                          {stat.title}
                        </CardTitle>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </CardHeader>
                      <CardContent className="mobile-card-spacing">
                        <div className="text-2xl sm:text-3xl font-bold text-foreground">
                          {stat.value}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.change}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-6 mb-6 lg:mb-8">
                {/* Patient Growth Chart */}
                <Card className="supabase-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Crescimento de Pacientes (6 meses)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 sm:h-64 lg:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={patientGrowthData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            className="opacity-30"
                          />
                          <XAxis
                            dataKey="month"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                          />
                          <YAxis
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--card-foreground))",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="patients"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{
                              fill: "hsl(var(--primary))",
                              strokeWidth: 2,
                              r: 3,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Clinic Activity Chart */}
                <Card className="supabase-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Atividade por Clínica (última semana)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 sm:h-64 lg:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clinicActivityData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            className="opacity-30"
                          />
                          <XAxis
                            dataKey="clinic"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                          />
                          <YAxis
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--card-foreground))",
                            }}
                          />
                          <Bar
                            dataKey="activity"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <Card className="supabase-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Últimas Atividades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentActivities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/30"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">
                              {activity.description}
                            </p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                              <p className="text-xs text-muted-foreground">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : currentView === "clinics" ? (
            <>
              {/* Clinic Management Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 dashboard-mobile-header">
                <div className="mb-3 sm:mb-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Clínicas Cadastradas
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Gerencie todas as clínicas do sistema
                  </p>
                </div>
                <Dialog
                  open={isCreateModalOpen}
                  onOpenChange={setIsCreateModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Clínica
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Nova Clínica</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome da Clínica *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Digite o nome da clínica"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cnpj">CNPJ *</Label>
                          <Input
                            id="cnpj"
                            value={formData.cnpj}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cnpj: formatCNPJ(e.target.value),
                              })
                            }
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail Institucional *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="contato@clinica.com.br"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: formatPhone(e.target.value),
                              })
                            }
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            placeholder="Digite a cidade"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">Estado *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                state: e.target.value,
                              })
                            }
                            placeholder="SP"
                            maxLength={2}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Endereço Completo *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          placeholder="Rua, número, bairro, CEP"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logo">Logotipo</Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Clique para fazer upload ou arraste uma imagem
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            PNG, JPG até 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          resetForm();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleCreateClinic}
                        className="bg-primary hover:bg-primary/90"
                        disabled={
                          !formData.name ||
                          !formData.cnpj ||
                          !formData.email ||
                          !formData.phone ||
                          !formData.city ||
                          !formData.state ||
                          !formData.address
                        }
                      >
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Filters and Search */}
              <Card className="supabase-card mb-4 sm:mb-6">
                <CardContent className="mobile-card-spacing p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar por nome, cidade ou estado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={(value: "all" | "active" | "inactive") =>
                        setStatusFilter(value)
                      }
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="active">Ativas</SelectItem>
                        <SelectItem value="inactive">Inativas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Clinics Table */}
              <Card className="supabase-card">
                <CardContent className="p-0">
                  {filteredClinics.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {searchTerm || statusFilter !== "all"
                          ? "Nenhuma clínica encontrada"
                          : "Nenhuma clínica cadastrada"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm || statusFilter !== "all"
                          ? "Tente ajustar os filtros de busca"
                          : "Comece cadastrando a primeira clínica do sistema"}
                      </p>
                      {!searchTerm && statusFilter === "all" && (
                        <Button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Cadastrar Primeira Clínica
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mobile-table-container overflow-x-auto max-w-full">
                        <Table
                          className="supabase-table"
                          style={{ minWidth: "350px", width: "100%" }}
                        >
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[100px] mobile-table-cell">
                                Nome
                              </TableHead>
                              <TableHead className="min-w-[60px] mobile-table-cell hidden md:table-cell">
                                Cidade
                              </TableHead>
                              <TableHead className="min-w-[40px] mobile-table-cell hidden md:table-cell">
                                Estado
                              </TableHead>
                              <TableHead className="min-w-[60px] mobile-table-cell">
                                Status
                              </TableHead>
                              <TableHead className="text-right min-w-[70px] mobile-table-cell">
                                Ações
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedClinics.map((clinic) => (
                              <TableRow key={clinic.id}>
                                <TableCell className="font-medium mobile-table-cell">
                                  <div>
                                    <div className="font-semibold text-gray-900 dark:text-white whitespace-nowrap text-xs sm:text-sm">
                                      {clinic.name}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                      {clinic.email}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap mobile-table-cell text-xs sm:text-sm hidden md:table-cell">
                                  {clinic.city}
                                </TableCell>
                                <TableCell className="whitespace-nowrap mobile-table-cell text-xs sm:text-sm hidden md:table-cell">
                                  {clinic.state}
                                </TableCell>
                                <TableCell className="mobile-table-cell">
                                  <Badge
                                    variant={
                                      clinic.status === "active"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={
                                      clinic.status === "active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 whitespace-nowrap text-xs"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 whitespace-nowrap text-xs"
                                    }
                                  >
                                    {clinic.status === "active"
                                      ? "Ativa"
                                      : "Inativa"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right mobile-table-cell">
                                  <div className="flex justify-end space-x-1 sm:space-x-2 whitespace-nowrap">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 sm:h-9 sm:w-9 md:hidden"
                                      title="Ver detalhes"
                                    >
                                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                    <Dialog
                                      open={editingClinic?.id === clinic.id}
                                      onOpenChange={(open) =>
                                        !open && setEditingClinic(null)
                                      }
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 sm:h-9 sm:w-9 hidden md:inline-flex"
                                          onClick={() =>
                                            handleEditClinic(clinic)
                                          }
                                        >
                                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Editar Clínica
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label htmlFor="edit-name">
                                                Nome da Clínica *
                                              </Label>
                                              <Input
                                                id="edit-name"
                                                value={formData.name}
                                                onChange={(e) =>
                                                  setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                  })
                                                }
                                                placeholder="Digite o nome da clínica"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="edit-cnpj">
                                                CNPJ *
                                              </Label>
                                              <Input
                                                id="edit-cnpj"
                                                value={formData.cnpj}
                                                onChange={(e) =>
                                                  setFormData({
                                                    ...formData,
                                                    cnpj: formatCNPJ(
                                                      e.target.value,
                                                    ),
                                                  })
                                                }
                                                placeholder="00.000.000/0000-00"
                                                maxLength={18}
                                              />
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label htmlFor="edit-email">
                                                E-mail Institucional *
                                              </Label>
                                              <Input
                                                id="edit-email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                  setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                  })
                                                }
                                                placeholder="contato@clinica.com.br"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="edit-phone">
                                                Telefone *
                                              </Label>
                                              <Input
                                                id="edit-phone"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                  setFormData({
                                                    ...formData,
                                                    phone: formatPhone(
                                                      e.target.value,
                                                    ),
                                                  })
                                                }
                                                placeholder="(00) 00000-0000"
                                                maxLength={15}
                                              />
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label htmlFor="edit-city">
                                                Cidade *
                                              </Label>
                                              <Input
                                                id="edit-city"
                                                value={formData.city}
                                                onChange={(e) =>
                                                  setFormData({
                                                    ...formData,
                                                    city: e.target.value,
                                                  })
                                                }
                                                placeholder="Digite a cidade"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="edit-state">
                                                Estado *
                                              </Label>
                                              <Input
                                                id="edit-state"
                                                value={formData.state}
                                                onChange={(e) =>
                                                  setFormData({
                                                    ...formData,
                                                    state: e.target.value,
                                                  })
                                                }
                                                placeholder="SP"
                                                maxLength={2}
                                              />
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-address">
                                              Endereço Completo *
                                            </Label>
                                            <Textarea
                                              id="edit-address"
                                              value={formData.address}
                                              onChange={(e) =>
                                                setFormData({
                                                  ...formData,
                                                  address: e.target.value,
                                                })
                                              }
                                              placeholder="Rua, número, bairro, CEP"
                                              rows={3}
                                            />
                                          </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                          <Button
                                            variant="outline"
                                            onClick={() => {
                                              setEditingClinic(null);
                                              resetForm();
                                            }}
                                          >
                                            Cancelar
                                          </Button>
                                          <Button
                                            onClick={handleUpdateClinic}
                                            className="bg-primary hover:bg-primary/90"
                                            disabled={
                                              !formData.name ||
                                              !formData.cnpj ||
                                              !formData.email ||
                                              !formData.phone ||
                                              !formData.city ||
                                              !formData.state ||
                                              !formData.address
                                            }
                                          >
                                            Salvar Alterações
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 sm:h-9 sm:w-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 hidden md:inline-flex"
                                        >
                                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            {clinic.status === "active"
                                              ? "Desativar"
                                              : "Ativar"}{" "}
                                            Clínica
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Tem certeza que deseja{" "}
                                            {clinic.status === "active"
                                              ? "desativar"
                                              : "ativar"}{" "}
                                            a clínica &quot;{clinic.name}&quot;?
                                            {clinic.status === "active" &&
                                              " Esta ação impedirá que a clínica acesse o sistema."}
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancelar
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              handleDeactivateClinic(clinic.id)
                                            }
                                            className={
                                              clinic.status === "active"
                                                ? "bg-red-600 hover:bg-red-700 text-white"
                                                : "bg-green-600 hover:bg-green-700 text-white"
                                            }
                                          >
                                            {clinic.status === "active"
                                              ? "Desativar"
                                              : "Ativar"}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 p-4 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Página {currentPage} de {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1),
                              )
                            }
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* General Settings */}
              <div className="flex flex-col mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Configurações Gerais do Sistema
                </h2>
                <p className="text-muted-foreground">
                  Personalize a identidade visual e configure as preferências
                  globais da plataforma
                </p>
              </div>

              {/* Visual Identity Section */}
              <Card className="mb-8 bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Identidade Visual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Main Logo Upload */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="main-logo"
                        className="text-base font-medium"
                      >
                        Logo Principal
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        {/* Logo Preview Area */}
                        <div className="h-32 flex items-center justify-center mb-4 bg-muted rounded-md">
                          {visualIdentity.mainLogoPreview ? (
                            <img
                              src={visualIdentity.mainLogoPreview}
                              alt="Logo principal"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Building2 className="h-16 w-16 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <label htmlFor="main-logo-upload">
                            <Button
                              variant="outline"
                              className="mr-2"
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById("main-logo-upload")
                                  ?.click()
                              }
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Escolher arquivo
                            </Button>
                            <input
                              id="main-logo-upload"
                              type="file"
                              accept="image/png,image/jpeg,image/svg+xml"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    alert("O arquivo deve ter no máximo 2MB");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    const result = e.target?.result as string;
                                    setVisualIdentity((prev) => ({
                                      ...prev,
                                      mainLogo: file,
                                      mainLogoPreview: result,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setVisualIdentity((prev) => ({
                                ...prev,
                                mainLogo: null,
                                mainLogoPreview: "",
                              }));
                            }}
                            disabled={!visualIdentity.mainLogoPreview}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          PNG, JPG ou SVG (máx. 2MB)
                        </p>
                      </div>
                    </div>

                    {/* Mobile Logo Upload */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="mobile-logo"
                        className="text-base font-medium"
                      >
                        Logo Mobile
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        {/* Logo Preview Area */}
                        <div className="h-32 flex items-center justify-center mb-4 bg-muted rounded-md">
                          {visualIdentity.mobileLogoPreview ? (
                            <img
                              src={visualIdentity.mobileLogoPreview}
                              alt="Logo mobile"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <label htmlFor="mobile-logo-upload">
                            <Button
                              variant="outline"
                              className="mr-2"
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById("mobile-logo-upload")
                                  ?.click()
                              }
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Escolher arquivo
                            </Button>
                            <input
                              id="mobile-logo-upload"
                              type="file"
                              accept="image/png,image/jpeg,image/svg+xml"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 1 * 1024 * 1024) {
                                    alert("O arquivo deve ter no máximo 1MB");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    const result = e.target?.result as string;
                                    setVisualIdentity((prev) => ({
                                      ...prev,
                                      mobileLogo: file,
                                      mobileLogoPreview: result,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setVisualIdentity((prev) => ({
                                ...prev,
                                mobileLogo: null,
                                mobileLogoPreview: "",
                              }));
                            }}
                            disabled={!visualIdentity.mobileLogoPreview}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Versão reduzida ou ícone (máx. 1MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Favicon Upload */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="favicon"
                        className="text-base font-medium"
                      >
                        Favicon
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        {/* Favicon Preview Area */}
                        <div className="h-16 flex items-center justify-center mb-4 bg-muted rounded-md">
                          {visualIdentity.faviconPreview ? (
                            <img
                              src={visualIdentity.faviconPreview}
                              alt="Favicon"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-muted-foreground/20 rounded-sm flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          <label htmlFor="favicon-upload">
                            <Button
                              variant="outline"
                              className="mr-2"
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById("favicon-upload")
                                  ?.click()
                              }
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Escolher arquivo
                            </Button>
                            <input
                              id="favicon-upload"
                              type="file"
                              accept="image/png,image/x-icon"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    const result = e.target?.result as string;
                                    setVisualIdentity((prev) => ({
                                      ...prev,
                                      favicon: file,
                                      faviconPreview: result,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setVisualIdentity((prev) => ({
                                ...prev,
                                favicon: null,
                                faviconPreview: "",
                              }));
                            }}
                            disabled={!visualIdentity.faviconPreview}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          PNG ou ICO (16x16 ou 32x32)
                        </p>
                      </div>
                    </div>

                    {/* Primary Color */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="primary-color"
                        className="text-base font-medium"
                      >
                        Cor Primária
                      </Label>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-md border border-border"
                          style={{
                            backgroundColor: visualIdentity.primaryColor,
                          }}
                        />
                        <Input
                          id="primary-color"
                          type="text"
                          placeholder="#10B981"
                          value={visualIdentity.primaryColor}
                          onChange={(e) => {
                            // Basic validation for hex color
                            const value = e.target.value;
                            if (
                              value.match(/^#([0-9A-F]{3}){1,2}$/i) ||
                              value === "#" ||
                              value === ""
                            ) {
                              setVisualIdentity((prev) => ({
                                ...prev,
                                primaryColor: value || "#10B981",
                              }));
                            }
                          }}
                          className="max-w-[150px]"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Create a color input element and trigger it
                            const input = document.createElement("input");
                            input.type = "color";
                            input.value = visualIdentity.primaryColor;
                            input.addEventListener("input", (e) => {
                              const target = e.target as HTMLInputElement;
                              setVisualIdentity((prev) => ({
                                ...prev,
                                primaryColor: target.value,
                              }));
                            });
                            input.click();
                          }}
                        >
                          Escolher
                        </Button>
                      </div>
                      <div className="flex mt-4">
                        <div className="w-8 h-8 rounded-l-md bg-green-50 border border-border" />
                        <div className="w-8 h-8 bg-green-100 border-t border-b border-border" />
                        <div className="w-8 h-8 bg-green-200 border-t border-b border-border" />
                        <div className="w-8 h-8 bg-green-300 border-t border-b border-border" />
                        <div className="w-8 h-8 bg-green-400 border-t border-b border-border" />
                        <div className="w-8 h-8 bg-green-500 border-t border-b border-border" />
                        <div className="w-8 h-8 bg-green-600 border-t border-b border-border" />
                        <div className="w-8 h-8 bg-green-700 border-t border-b border-border" />
                        <div className="w-8 h-8 bg-green-800 border-t border-b border-border" />
                        <div className="w-8 h-8 rounded-r-md bg-green-900 border border-border" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        // Save visual identity settings
                        console.log(
                          "Salvando configurações de identidade visual:",
                          visualIdentity,
                        );

                        // In a real app, this would send the data to an API
                        // For now, just show a success message
                        alert(
                          "Configurações de identidade visual salvas com sucesso!",
                        );
                      }}
                    >
                      Salvar alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Information Section */}
              <Card className="mb-8 bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Informações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* System Version */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="system-version"
                        className="text-base font-medium"
                      >
                        Versão do Sistema
                      </Label>
                      <Input
                        id="system-version"
                        value={systemInfo.version}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    {/* Base URL */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="base-url"
                        className="text-base font-medium"
                      >
                        URL Base do Sistema
                      </Label>
                      <Input
                        id="base-url"
                        placeholder="https://app.clinicsys.com"
                        value={systemInfo.baseUrl}
                        onChange={(e) =>
                          setSystemInfo((prev) => ({
                            ...prev,
                            baseUrl: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Terms URL */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="terms-url"
                      className="text-base font-medium"
                    >
                      URL de Termos de Uso e Privacidade
                    </Label>
                    <Input
                      id="terms-url"
                      placeholder="https://clinicsys.com/termos"
                      value={systemInfo.termsUrl}
                      onChange={(e) =>
                        setSystemInfo((prev) => ({
                          ...prev,
                          termsUrl: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Maintenance Mode */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h3 className="text-base font-medium text-foreground">
                        Modo de Manutenção
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Ativa uma mensagem de manutenção para todos os usuários
                      </p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={systemInfo.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSystemInfo((prev) => ({
                          ...prev,
                          maintenanceMode: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        // Save system information settings
                        console.log(
                          "Salvando informações do sistema:",
                          systemInfo,
                        );

                        // In a real app, this would send the data to an API
                        // For now, just show a success message
                        alert("Informações do sistema salvas com sucesso!");
                      }}
                    >
                      Salvar alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Global Preferences Section */}
              <Card className="mb-8 bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Preferências Globais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Default Theme */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Tema Padrão</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="theme-light"
                          name="default-theme"
                          className="h-4 w-4 text-primary"
                          checked={globalPreferences.defaultTheme === "light"}
                          onChange={() =>
                            setGlobalPreferences((prev) => ({
                              ...prev,
                              defaultTheme: "light",
                            }))
                          }
                        />
                        <Label
                          htmlFor="theme-light"
                          className="text-sm font-normal"
                        >
                          Claro
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="theme-dark"
                          name="default-theme"
                          className="h-4 w-4 text-primary"
                          checked={globalPreferences.defaultTheme === "dark"}
                          onChange={() =>
                            setGlobalPreferences((prev) => ({
                              ...prev,
                              defaultTheme: "dark",
                            }))
                          }
                        />
                        <Label
                          htmlFor="theme-dark"
                          className="text-sm font-normal"
                        >
                          Escuro
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="theme-auto"
                          name="default-theme"
                          className="h-4 w-4 text-primary"
                          checked={globalPreferences.defaultTheme === "auto"}
                          onChange={() =>
                            setGlobalPreferences((prev) => ({
                              ...prev,
                              defaultTheme: "auto",
                            }))
                          }
                        />
                        <Label
                          htmlFor="theme-auto"
                          className="text-sm font-normal"
                        >
                          Automático (SO)
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Default Language */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="default-language"
                      className="text-base font-medium"
                    >
                      Idioma Padrão
                    </Label>
                    <Select
                      value={globalPreferences.defaultLanguage}
                      onValueChange={(value) =>
                        setGlobalPreferences((prev) => ({
                          ...prev,
                          defaultLanguage: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">
                          Português (Brasil)
                        </SelectItem>
                        <SelectItem value="en-US" disabled>
                          English (US) - Em breve
                        </SelectItem>
                        <SelectItem value="es-ES" disabled>
                          Español - Em breve
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-foreground">
                          Notificações push ativas por padrão
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Ativa notificações push para novos usuários
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={globalPreferences.pushNotifications}
                        onCheckedChange={(checked) =>
                          setGlobalPreferences((prev) => ({
                            ...prev,
                            pushNotifications: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-foreground">
                          Ativar novos cadastros de clínicas automaticamente
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Novas clínicas ficam ativas sem aprovação manual
                        </p>
                      </div>
                      <Switch
                        id="auto-activate-clinics"
                        checked={globalPreferences.autoActivateClinics}
                        onCheckedChange={(checked) =>
                          setGlobalPreferences((prev) => ({
                            ...prev,
                            autoActivateClinics: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-foreground">
                          Permitir branding individual por clínica
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Cada clínica pode personalizar sua própria marca
                        </p>
                      </div>
                      <Switch
                        id="individual-branding"
                        checked={globalPreferences.individualBranding}
                        onCheckedChange={(checked) =>
                          setGlobalPreferences((prev) => ({
                            ...prev,
                            individualBranding: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                      onClick={() => {
                        // Save global preferences settings
                        console.log(
                          "Salvando preferências globais:",
                          globalPreferences,
                        );

                        // In a real app, this would send the data to an API
                        // For now, just show a success message
                        alert("Preferências globais salvas com sucesso!");
                      }}
                    >
                      Salvar Todas as Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t border-border/50 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center justify-around py-2 px-4">
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentView === "dashboard"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView("clinics")}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentView === "clinics"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-5 w-5" />
            <span className="text-xs mt-1">Clínicas</span>
          </button>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-background border-l border-border/50 shadow-xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
            <span className="text-lg font-semibold">Super Admin</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            <div className="border-t border-border/50 pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Tema</span>
                <ThemeToggle />
              </div>

              <button
                onClick={() => {
                  setCurrentView("profile");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors text-foreground hover:bg-muted"
              >
                <User className="h-5 w-5 mr-3" />
                Meu Perfil
              </button>

              <button
                onClick={() => {
                  setCurrentView("settings");
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors text-foreground hover:bg-muted"
              >
                <Settings className="h-5 w-5 mr-3" />
                Configurações
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sair
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
