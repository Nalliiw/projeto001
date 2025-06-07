import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  User,
  LogOut,
  Trophy,
  Workflow,
  BarChart3,
  Bell,
  Smartphone,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProfilePage from "@/components/ProfilePage";
import AppPreferencesPage from "@/components/AppPreferencesPage";
import FlowBuilder from "@/components/flowbuilder/FlowBuilder";

const SpecialistDashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<
    "dashboard" | "patients" | "flows" | "profile" | "preferences" | "flowbuilder"
  >("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for patients
  const patients = [
    {
      id: "1",
      name: "Maria Silva",
      email: "maria@email.com",
      status: "active",
      lastActivity: "2024-03-15",
      progress: 75,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    },
    {
      id: "2",
      name: "João Santos",
      email: "joao@email.com",
      status: "pending",
      lastActivity: "2024-03-14",
      progress: 45,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    },
    {
      id: "3",
      name: "Ana Costa",
      email: "ana@email.com",
      status: "completed",
      lastActivity: "2024-03-13",
      progress: 100,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    },
  ];

  // Mock data for flows
  const flows = [
    {
      id: "1",
      name: "Avaliação Inicial",
      description: "Fluxo para novos pacientes",
      status: "active",
      patients: 12,
      completionRate: 85,
      createdAt: "2024-02-15",
    },
    {
      id: "2",
      name: "Acompanhamento Semanal",
      description: "Check-in semanal com pacientes",
      status: "active",
      patients: 8,
      completionRate: 92,
      createdAt: "2024-03-01",
    },
    {
      id: "3",
      name: "Feedback Pós-Consulta",
      description: "Coleta de feedback após consultas",
      status: "draft",
      patients: 0,
      completionRate: 0,
      createdAt: "2024-03-10",
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      case "draft":
        return "Rascunho";
      default:
        return status;
    }
  };

  if (currentView === "profile") {
    return <ProfilePage onBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "preferences") {
    return <AppPreferencesPage onBack={() => setCurrentView("dashboard")} />;
  }

  if (currentView === "flowbuilder") {
    return <FlowBuilder />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">
                Dashboard do Especialista
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => setCurrentView("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView("preferences")}>
                    <Smartphone className="mr-2 h-4 w-4" />
                    <span>Preferências do App</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === "dashboard"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView("patients")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === "patients"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              Pacientes
            </button>
            <button
              onClick={() => setCurrentView("flows")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === "flows"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              Fluxos
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {currentView === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pacientes Ativos
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +3 desde a semana passada
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Consultas Hoje
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    2 pendentes, 6 concluídas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Engajamento
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Fluxos Ativos
                  </CardTitle>
                  <Workflow className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    2 novos esta semana
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Paciente
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setCurrentView("flowbuilder")}
                  >
                    <Workflow className="mr-2 h-4 w-4" />
                    Criar Fluxo
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Dica
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximas Consultas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Maria Silva</p>
                        <p className="text-xs text-muted-foreground">14:00</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">João Santos</p>
                        <p className="text-xs text-muted-foreground">15:30</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm">Fluxo completado</p>
                        <p className="text-xs text-muted-foreground">
                          Ana Costa - há 2h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-sm">Resposta pendente</p>
                        <p className="text-xs text-muted-foreground">
                          João Santos - há 4h
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === "patients" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Pacientes</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Paciente
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>

            {/* Patients List */}
            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={patient.avatar} alt={patient.name} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {patient.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Última atividade: {patient.lastActivity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(patient.status)}>
                            {getStatusText(patient.status)}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            Progresso: {patient.progress}%
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Enviar Mensagem</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === "flows" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Fluxos de Atendimento
              </h2>
              <Button onClick={() => setCurrentView("flowbuilder")}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Fluxo
              </Button>
            </div>

            {/* Flows Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flows.map((flow) => (
                <Card key={flow.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                      <Badge className={getStatusColor(flow.status)}>
                        {getStatusText(flow.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {flow.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Pacientes:</span>
                        <span className="font-medium">{flow.patients}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Conclusão:</span>
                        <span className="font-medium">{flow.completionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Criado em:</span>
                        <span className="font-medium">{flow.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setCurrentView("flowbuilder")}
                      >
                        <Workflow className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Relatório
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpecialistDashboard;