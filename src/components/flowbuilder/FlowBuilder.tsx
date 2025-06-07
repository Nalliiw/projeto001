import React, { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  MessageSquare,
  HelpCircle,
  CheckSquare,
  ArrowRight,
  Trash2,
  Edit,
  Play,
  Save,
  Eye,
  Target,
  Link,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types for Flow Builder
interface FlowNode {
  id: string;
  type: "message" | "question" | "condition" | "action";
  title: string;
  content: string;
  position: { x: number; y: number };
  options?: string[];
  connections: Connection[];
  metadata?: {
    questionType?: "text" | "multiple_choice" | "yes_no" | "scale";
    required?: boolean;
    validation?: string;
  };
}

interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceOption?: string; // For conditional connections
  label?: string;
  animated?: boolean;
}

interface ConnectionInProgress {
  sourceNodeId: string;
  sourceOption?: string;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [connectionInProgress, setConnectionInProgress] = useState<ConnectionInProgress | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [flowTitle, setFlowTitle] = useState("Novo Fluxo");
  const [previewMode, setPreviewMode] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // Update canvas offset when component mounts
  useEffect(() => {
    const updateCanvasOffset = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasOffset({ x: rect.left, y: rect.top });
      }
    };

    updateCanvasOffset();
    window.addEventListener('resize', updateCanvasOffset);
    window.addEventListener('scroll', updateCanvasOffset);

    return () => {
      window.removeEventListener('resize', updateCanvasOffset);
      window.removeEventListener('scroll', updateCanvasOffset);
    };
  }, []);

  // Handle mouse move for connection drawing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (connectionInProgress) {
        setConnectionInProgress(prev => prev ? {
          ...prev,
          currentPosition: {
            x: e.clientX - canvasOffset.x,
            y: e.clientY - canvasOffset.y
          }
        } : null);
      }
    };

    const handleMouseUp = () => {
      if (connectionInProgress) {
        setConnectionInProgress(null);
        setIsConnecting(false);
      }
    };

    if (isConnecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [connectionInProgress, isConnecting, canvasOffset]);

  const addNode = (type: FlowNode['type']) => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type,
      title: getDefaultTitle(type),
      content: getDefaultContent(type),
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      },
      connections: [],
      options: type === "question" ? ["Sim", "Não"] : undefined,
      metadata: type === "question" ? {
        questionType: "yes_no",
        required: true
      } : undefined
    };

    setNodes(prev => [...prev, newNode]);
  };

  const getDefaultTitle = (type: FlowNode['type']) => {
    switch (type) {
      case "message": return "Nova Mensagem";
      case "question": return "Nova Pergunta";
      case "condition": return "Nova Condição";
      case "action": return "Nova Ação";
      default: return "Novo Nó";
    }
  };

  const getDefaultContent = (type: FlowNode['type']) => {
    switch (type) {
      case "message": return "Digite sua mensagem aqui...";
      case "question": return "Qual é sua pergunta?";
      case "condition": return "Defina a condição...";
      case "action": return "Descreva a ação...";
      default: return "";
    }
  };

  const getNodeIcon = (type: FlowNode['type']) => {
    switch (type) {
      case "message": return MessageSquare;
      case "question": return HelpCircle;
      case "condition": return CheckSquare;
      case "action": return Target;
      default: return MessageSquare;
    }
  };

  const getNodeColor = (type: FlowNode['type']) => {
    switch (type) {
      case "message": return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
      case "question": return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
      case "condition": return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "action": return "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800";
      default: return "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800";
    }
  };

  const handleNodeEdit = (node: FlowNode) => {
    setSelectedNode(node);
    setIsEditModalOpen(true);
  };

  const handleNodeUpdate = (updatedNode: FlowNode) => {
    setNodes(prev => prev.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
    setIsEditModalOpen(false);
    setSelectedNode(null);
  };

  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
    ));
  };

  const startConnection = (nodeId: string, option?: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const startPosition = {
      x: node.position.x + 300, // Right edge of card
      y: node.position.y + 60   // Center of card
    };

    setConnectionInProgress({
      sourceNodeId: nodeId,
      sourceOption: option,
      startPosition,
      currentPosition: startPosition
    });
    setIsConnecting(true);
  };

  const completeConnection = (targetNodeId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    if (!connectionInProgress || connectionInProgress.sourceNodeId === targetNodeId) {
      setConnectionInProgress(null);
      setIsConnecting(false);
      return;
    }

    const newConnection: Connection = {
      id: `conn-${Date.now()}`,
      sourceNodeId: connectionInProgress.sourceNodeId,
      targetNodeId,
      sourceOption: connectionInProgress.sourceOption,
      label: connectionInProgress.sourceOption || "Próximo",
      animated: true
    };

    setConnections(prev => [...prev, newConnection]);
    setConnectionInProgress(null);
    setIsConnecting(false);
  };

  const handleNodeDrag = (nodeId: string, newPosition: { x: number; y: number }) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position: newPosition } : node
    ));
  };

  const renderConnection = (connection: Connection) => {
    const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
    const targetNode = nodes.find(n => n.id === connection.targetNodeId);
    
    if (!sourceNode || !targetNode) return null;

    const start = {
      x: sourceNode.position.x + 300,
      y: sourceNode.position.y + 60
    };
    
    const end = {
      x: targetNode.position.x,
      y: targetNode.position.y + 60
    };

    const midX = (start.x + end.x) / 2;
    const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

    return (
      <g key={connection.id}>
        <path
          d={path}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          className={connection.animated ? "animate-pulse" : ""}
          markerEnd="url(#arrowhead)"
        />
        {connection.label && (
          <text
            x={midX}
            y={(start.y + end.y) / 2 - 10}
            textAnchor="middle"
            className="text-xs fill-gray-600 dark:fill-gray-400"
            style={{ fontSize: '12px' }}
          >
            {connection.label}
          </text>
        )}
        {/* Animated dot */}
        {connection.animated && (
          <circle r="3" fill="#3b82f6" className="animate-pulse">
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href={`#path-${connection.id}`} />
            </animateMotion>
          </circle>
        )}
      </g>
    );
  };

  const renderConnectionInProgress = () => {
    if (!connectionInProgress) return null;

    const start = connectionInProgress.startPosition;
    const end = connectionInProgress.currentPosition;
    const midX = (start.x + end.x) / 2;
    const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;

    return (
      <path
        d={path}
        stroke="#3b82f6"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,5"
        className="animate-pulse"
      />
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={flowTitle}
              onChange={(e) => setFlowTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none p-0 focus:ring-0"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Editar" : "Visualizar"}
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Testar Fluxo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!previewMode && (
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Componentes
            </h3>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addNode("message")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addNode("question")}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Pergunta
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addNode("condition")}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Condição
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => addNode("action")}
              >
                <Target className="h-4 w-4 mr-2" />
                Ação
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Instruções
              </h3>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <p>• Arraste os cards para posicioná-los</p>
                <p>• Clique nos ícones das opções para criar conexões</p>
                <p>• Clique no ícone de alvo (esquerda) para receber conexões</p>
                <p>• Use o botão editar para configurar cada componente</p>
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-auto bg-gray-100 dark:bg-gray-900"
          style={{ cursor: isConnecting ? 'crosshair' : 'default' }}
        >
          {/* SVG for connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6b7280"
                />
              </marker>
            </defs>
            
            {connections.map(renderConnection)}
            {renderConnectionInProgress()}
          </svg>

          {/* Nodes */}
          <div className="relative" style={{ zIndex: 2 }}>
            <AnimatePresence>
              {nodes.map((node) => (
                <FlowNode
                  key={node.id}
                  node={node}
                  onEdit={handleNodeEdit}
                  onDelete={handleNodeDelete}
                  onDrag={handleNodeDrag}
                  onStartConnection={startConnection}
                  onCompleteConnection={completeConnection}
                  isConnecting={isConnecting}
                  previewMode={previewMode}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <MessageSquare className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Comece criando seu primeiro componente
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Use a barra lateral para adicionar mensagens, perguntas e ações
                </p>
                <Button onClick={() => addNode("message")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Mensagem
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <NodeEditModal
        node={selectedNode}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNode(null);
        }}
        onSave={handleNodeUpdate}
      />
    </div>
  );
};

// Flow Node Component
interface FlowNodeProps {
  node: FlowNode;
  onEdit: (node: FlowNode) => void;
  onDelete: (nodeId: string) => void;
  onDrag: (nodeId: string, position: { x: number; y: number }) => void;
  onStartConnection: (nodeId: string, option?: string, event?: React.MouseEvent) => void;
  onCompleteConnection: (nodeId: string, event?: React.MouseEvent) => void;
  isConnecting: boolean;
  previewMode: boolean;
}

const FlowNode: React.FC<FlowNodeProps> = ({
  node,
  onEdit,
  onDelete,
  onDrag,
  onStartConnection,
  onCompleteConnection,
  isConnecting,
  previewMode
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const Icon = getNodeIcon(node.type);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (previewMode || isConnecting) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      onDrag(node.id, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute pointer-events-auto"
      style={{
        left: node.position.x,
        top: node.position.y,
        cursor: isDragging ? 'grabbing' : (previewMode ? 'default' : 'grab')
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className={`w-80 ${getNodeColor(node.type)} shadow-lg hover:shadow-xl transition-shadow`}>
        {/* Connection target (left side) */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-pointer hover:bg-blue-600 transition-colors z-10"
          onClick={(e) => onCompleteConnection(node.id, e)}
          style={{ display: isConnecting ? 'block' : 'none' }}
        />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <CardTitle className="text-sm font-medium">{node.title}</CardTitle>
            </div>
            
            {!previewMode && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(node);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node.id);
                  }}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {node.content}
          </p>

          {/* Options for questions */}
          {node.type === "question" && node.options && (
            <div className="space-y-2">
              {node.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="text-sm">{option}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
                    onClick={(e) => onStartConnection(node.id, option, e)}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Connection button for other types */}
          {node.type !== "question" && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-700"
                onClick={(e) => onStartConnection(node.id, undefined, e)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Node Edit Modal Component
interface NodeEditModalProps {
  node: FlowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (node: FlowNode) => void;
}

const NodeEditModal: React.FC<NodeEditModalProps> = ({
  node,
  isOpen,
  onClose,
  onSave
}) => {
  const [editedNode, setEditedNode] = useState<FlowNode | null>(null);

  React.useEffect(() => {
    if (node) {
      setEditedNode({ ...node });
    }
  }, [node]);

  if (!editedNode) return null;

  const handleSave = () => {
    onSave(editedNode);
  };

  const addOption = () => {
    setEditedNode(prev => prev ? {
      ...prev,
      options: [...(prev.options || []), "Nova opção"]
    } : null);
  };

  const updateOption = (index: number, value: string) => {
    setEditedNode(prev => prev ? {
      ...prev,
      options: prev.options?.map((opt, i) => i === index ? value : opt)
    } : null);
  };

  const removeOption = (index: number) => {
    setEditedNode(prev => prev ? {
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    } : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar {editedNode.type === "message" ? "Mensagem" : 
                                editedNode.type === "question" ? "Pergunta" :
                                editedNode.type === "condition" ? "Condição" : "Ação"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={editedNode.title}
              onChange={(e) => setEditedNode(prev => prev ? { ...prev, title: e.target.value } : null)}
            />
          </div>

          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={editedNode.content}
              onChange={(e) => setEditedNode(prev => prev ? { ...prev, content: e.target.value } : null)}
              rows={3}
            />
          </div>

          {editedNode.type === "question" && (
            <>
              <div>
                <Label>Tipo de Pergunta</Label>
                <Select
                  value={editedNode.metadata?.questionType || "yes_no"}
                  onValueChange={(value) => setEditedNode(prev => prev ? {
                    ...prev,
                    metadata: { ...prev.metadata, questionType: value as any }
                  } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes_no">Sim/Não</SelectItem>
                    <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                    <SelectItem value="text">Texto Livre</SelectItem>
                    <SelectItem value="scale">Escala (1-10)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editedNode.metadata?.questionType === "multiple_choice" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Opções de Resposta</Label>
                    <Button variant="outline" size="sm" onClick={addOption}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {editedNode.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Opção ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlowBuilder;