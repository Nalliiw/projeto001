import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Shield,
  Palette,
  Globe,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AppPreferencesPageProps {
  onBack: () => void;
}

const AppPreferencesPage: React.FC<AppPreferencesPageProps> = ({ onBack }) => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    reminders: true,
    updates: true,
  });
  const [privacy, setPrivacy] = useState({
    analytics: false,
    dataSharing: false,
    locationTracking: false,
  });
  const [language, setLanguage] = useState("pt-BR");
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    // In a real app, this would save preferences to backend
    console.log("Saving preferences:", {
      notifications,
      privacy,
      language,
      autoSync,
      offlineMode,
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-semibold text-foreground">
              Preferências do App
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-4 sm:py-8 dashboard-mobile-content px-3 sm:px-6 lg:px-8">
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            <AlertDescription>
              Preferências salvas com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 sm:space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader className="settings-mobile-item">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="settings-mobile-item space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm sm:text-base font-medium">
                    Notificações Push
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receber notificações no dispositivo
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Notificações por E-mail
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por e-mail
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Lembretes</Label>
                  <p className="text-sm text-muted-foreground">
                    Lembretes de medicação e consultas
                  </p>
                </div>
                <Switch
                  checked={notifications.reminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, reminders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Atualizações do App
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações sobre novas funcionalidades
                  </p>
                </div>
                <Switch
                  checked={notifications.updates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, updates: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidade e Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Análise de Uso
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir coleta de dados para melhorar o app
                  </p>
                </div>
                <Switch
                  checked={privacy.analytics}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, analytics: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Compartilhamento de Dados
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Compartilhar dados com parceiros para pesquisa
                  </p>
                </div>
                <Switch
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, dataSharing: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Rastreamento de Localização
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Usar localização para funcionalidades específicas
                  </p>
                </div>
                <Switch
                  checked={privacy.locationTracking}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, locationTracking: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Configurações do App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Idioma
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">
                    Sincronização Automática
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar dados automaticamente
                  </p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Modo Offline</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir uso do app sem conexão
                  </p>
                </div>
                <Switch
                  checked={offlineMode}
                  onCheckedChange={setOfflineMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
            >
              Salvar Preferências
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppPreferencesPage;
