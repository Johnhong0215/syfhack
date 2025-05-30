"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Bell,
  Bug,
  Calendar,
  CheckCircle2,
  Circle,
  Filter,
  Home,
  Kanban,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Target,
  Users,
  Zap,
  ClipboardList,
  GripVertical,
} from "lucide-react"

interface Issue {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "critical"
  type: "story" | "bug" | "task"
  assignee: string
  reporter: string
  created: string
  sprint?: string
  storyPoints?: number
}

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
}

interface ProjectConfig {
  name: string
  key: string
  description: string
  statusColumns: Array<{
    id: string
    title: string
    status: Issue["status"]
    color: string
  }>
  priorities: Array<{
    id: string
    name: string
    color: string
  }>
  issueTypes: Array<{
    id: string
    name: string
    icon: string
    color: string
  }>
}

// Centralized project configuration - easy to modify
const projectConfig: ProjectConfig = {
  name: "Synchrum Master",
  key: "HACK",
  description: "SYF Agentic Scrum Support",
  statusColumns: [
    { id: "todo", title: "To Do", status: "todo", color: "bg-gray-100" },
    { id: "in-progress", title: "In Progress", status: "in-progress", color: "bg-blue-100" },
    { id: "review", title: "Review", status: "review", color: "bg-yellow-100" },
    { id: "done", title: "Done", status: "done", color: "bg-green-100" },
  ],
  priorities: [
    { id: "low", name: "Low", color: "bg-green-500" },
    { id: "medium", name: "Medium", color: "bg-yellow-500" },
    { id: "high", name: "High", color: "bg-orange-500" },
    { id: "critical", name: "Critical", color: "bg-red-500" },
  ],
  issueTypes: [
    { id: "story", name: "Story", icon: "circle", color: "text-blue-500" },
    { id: "bug", name: "Bug", icon: "bug", color: "text-red-500" },
    { id: "task", name: "Task", icon: "check-circle", color: "text-green-500" },
  ],
}

// Team members - easy to modify
const teamMembers: TeamMember[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com" },
  { id: "4", name: "Bob Wilson", email: "bob@example.com" },
  { id: "5", name: "Charlie Brown", email: "charlie@example.com" },
  { id: "6", name: "Diana Prince", email: "diana@example.com" },
  { id: "7", name: "Eve Davis", email: "eve@example.com" },
  { id: "8", name: "Frank Miller", email: "frank@example.com" },
]

// Initial issues data - easy to modify
const initialIssuesData: Issue[] = [
  {
    id: "HACK-1",
    title: "Set up authentication system",
    description: "Implement user login and registration functionality",
    status: "in-progress",
    priority: "high",
    type: "story",
    assignee: "John Doe",
    reporter: "Jane Smith",
    created: "2024-01-15",
    storyPoints: 5,
  },
  {
    id: "HACK-2",
    title: "Design landing page",
    description: "Create an attractive landing page for the application",
    status: "todo",
    priority: "medium",
    type: "task",
    assignee: "Alice Johnson",
    reporter: "Bob Wilson",
    created: "2024-01-16",
    storyPoints: 3,
  },
  {
    id: "HACK-3",
    title: "Fix mobile responsiveness",
    description: "Address layout issues on mobile devices",
    status: "review",
    priority: "high",
    type: "bug",
    assignee: "Charlie Brown",
    reporter: "Diana Prince",
    created: "2024-01-14",
    storyPoints: 2,
  },
  {
    id: "HACK-4",
    title: "Add dark mode support",
    description: "Implement dark mode toggle functionality",
    status: "done",
    priority: "low",
    type: "story",
    assignee: "Eve Davis",
    reporter: "Frank Miller",
    created: "2024-01-13",
    storyPoints: 3,
  },
  {
    id: "HACK-5",
    title: "Implement search functionality",
    description: "Add global search across all issues and projects",
    status: "todo",
    priority: "medium",
    type: "story",
    assignee: "John Doe",
    reporter: "Jane Smith",
    created: "2024-01-17",
    storyPoints: 8,
  },
  {
    id: "HACK-6",
    title: "Performance optimization",
    description: "Optimize application performance and loading times",
    status: "todo",
    priority: "high",
    type: "task",
    assignee: "",
    reporter: "Alice Johnson",
    created: "2024-01-18",
    storyPoints: 5,
  },
]

export default function JiraFrontend() {
  const [issues, setIssues] = useState<Issue[]>(initialIssuesData)
  const [currentView, setCurrentView] = useState<"dashboard" | "board">("dashboard")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [draggedIssue, setDraggedIssue] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    type: "story" as const,
    priority: "medium" as const,
    assignee: "",
  })

  // Helper functions for data management
  const createIssue = () => {
    const issue: Issue = {
      id: `${projectConfig.key}-${issues.length + 1}`,
      title: newIssue.title,
      description: newIssue.description,
      status: "todo",
      priority: newIssue.priority,
      type: newIssue.type,
      assignee: newIssue.assignee,
      reporter: "Current User",
      created: new Date().toISOString().split("T")[0],
      storyPoints: 3,
    }
    setIssues([...issues, issue])
    setNewIssue({ title: "", description: "", type: "story", priority: "medium", assignee: "" })
    setIsCreateDialogOpen(false)
  }

  const updateIssueStatus = (issueId: string, newStatus: Issue["status"]) => {
    setIssues(issues.map((issue) => (issue.id === issueId ? { ...issue, status: newStatus } : issue)))
  }

  const getPriorityConfig = (priority: string) => {
    return projectConfig.priorities.find((p) => p.id === priority) || projectConfig.priorities[1]
  }

  const getTypeConfig = (type: string) => {
    return projectConfig.issueTypes.find((t) => t.id === type) || projectConfig.issueTypes[0]
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = getTypeConfig(type)
    switch (typeConfig.icon) {
      case "bug":
        return <Bug className={`w-4 h-4 ${typeConfig.color}`} />
      case "circle":
        return <Circle className={`w-4 h-4 ${typeConfig.color}`} />
      case "check-circle":
        return <CheckCircle2 className={`w-4 h-4 ${typeConfig.color}`} />
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    setDraggedIssue(issueId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", issueId)
  }

  const handleDragEnd = () => {
    setDraggedIssue(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnStatus: Issue["status"]) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnStatus)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnStatus: Issue["status"]) => {
    e.preventDefault()
    const issueId = e.dataTransfer.getData("text/html")

    if (issueId && draggedIssue) {
      // Update the issue status immediately
      setIssues((prevIssues) =>
        prevIssues.map((issue) => (issue.id === issueId ? { ...issue, status: columnStatus } : issue)),
      )
    }

    setDraggedIssue(null)
    setDragOverColumn(null)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">{projectConfig.name}</h1>
          <p className="text-sm text-gray-500">{projectConfig.description}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={currentView === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("dashboard")}
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={currentView === "board" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("board")}
          >
            <Kanban className="w-4 h-4 mr-2" />
            Board
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => (window.location.href = "/backlog")}>
            <ClipboardList className="w-4 h-4 mr-2" />
            Backlog
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => (window.location.href = "/assistant")}
          >
            <Zap className="w-4 h-4 mr-2" />
            Assistant
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="w-4 h-4 mr-2" />
            Team
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold">
              {currentView === "dashboard" ? "Project Dashboard" : "Kanban Board"}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search issues..." className="pl-10 w-64" />
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Issue</DialogTitle>
                  <DialogDescription>Add a new issue to your project backlog.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                      placeholder="Enter issue title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                      placeholder="Enter issue description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newIssue.type}
                        onValueChange={(value: any) => setNewIssue({ ...newIssue, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectConfig.issueTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newIssue.priority}
                        onValueChange={(value: any) => setNewIssue({ ...newIssue, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectConfig.priorities.map((priority) => (
                            <SelectItem key={priority.id} value={priority.id}>
                              {priority.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="assignee">Assignee</Label>
                    <Select
                      value={newIssue.assignee}
                      onValueChange={(value: any) => setNewIssue({ ...newIssue, assignee: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={createIssue}>
                    Create Issue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {currentView === "dashboard" ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{issues.length}</div>
                    <p className="text-xs text-muted-foreground">+2 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{issues.filter((i) => i.status === "in-progress").length}</div>
                    <p className="text-xs text-muted-foreground">Active development</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{issues.filter((i) => i.status === "done").length}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((issues.filter((i) => i.status === "done").length / issues.length) * 100)}% completion
                      rate
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                    <Bug className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {issues.filter((i) => i.priority === "high" || i.priority === "critical").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Needs attention</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Issues */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Issues</CardTitle>
                  <CardDescription>Latest issues created in your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {issues.slice(0, 5).map((issue) => (
                      <div key={issue.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(issue.type)}
                          <span className="font-medium">{issue.id}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{issue.title}</p>
                          <p className="text-sm text-gray-500">{issue.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityConfig(issue.priority).color}`} />
                          <Badge variant="outline">{issue.status}</Badge>
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {issue.assignee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Kanban Board */
            <div className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Sprint Board</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Sprint 1
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6 h-full">
                {projectConfig.statusColumns.map((column) => (
                  <div
                    key={column.id}
                    className={`${column.color} rounded-lg p-4 transition-all duration-200 ${
                      dragOverColumn === column.status ? "ring-2 ring-blue-400 bg-blue-50" : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, column.status)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.status)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-700">{column.title}</h4>
                      <Badge variant="secondary">
                        {issues.filter((issue) => issue.status === column.status).length}
                      </Badge>
                    </div>

                    <div className="space-y-3 min-h-[200px]">
                      {issues
                        .filter((issue) => issue.status === column.status)
                        .map((issue) => (
                          <Card
                            key={issue.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, issue.id)}
                            onDragEnd={handleDragEnd}
                            className={`cursor-move hover:shadow-md transition-all duration-200 ${
                              draggedIssue === issue.id ? "opacity-50 rotate-2 scale-105" : ""
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {getTypeIcon(issue.type)}
                                  <span className="text-sm font-medium text-gray-600">{issue.id}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <GripVertical className="w-3 h-3 text-gray-400" />
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <h5 className="font-medium mb-2">{issue.title}</h5>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{issue.description}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${getPriorityConfig(issue.priority).color}`} />
                                  {issue.storyPoints && (
                                    <Badge variant="outline" className="text-xs">
                                      {issue.storyPoints} pts
                                    </Badge>
                                  )}
                                </div>
                                {issue.assignee ? (
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {issue.assignee
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs text-gray-500">?</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
