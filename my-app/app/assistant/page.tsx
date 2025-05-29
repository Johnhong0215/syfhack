"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, Bot, Bug, Calendar, CheckCircle2, Circle, Upload, FileAudio, GripVertical } from "lucide-react"

// Centralized project configuration
const projectConfig = {
  name: "HackTracker",
  key: "HACK",
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

// Team members
const teamMembers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com" },
  { id: "4", name: "Bob Wilson", email: "bob@example.com" },
  { id: "5", name: "Charlie Brown", email: "charlie@example.com" },
  { id: "6", name: "Diana Prince", email: "diana@example.com" },
  { id: "7", name: "Eve Davis", email: "eve@example.com" },
  { id: "8", name: "Frank Miller", email: "frank@example.com" },
]

// Available sprints
const availableSprints = [
  { id: "S-3", name: "Sprint 3", status: "active" },
  { id: "S-4", name: "Sprint 4", status: "planning" },
  { id: "S-5", name: "Sprint 5", status: "planning" },
]

interface GeneratedStory {
  id: string
  title: string
  description: string
  type: "story" | "bug" | "task"
  priority: "low" | "medium" | "high" | "critical"
  storyPoints: number
  acceptanceCriteria: string[]
  status: "generated" | "in-backlog" | "in-sprint"
  assignedTo?: string
  sprint?: string
}

// Pre-populated stories from meeting analysis
const initialGeneratedStories: GeneratedStory[] = [
  {
    id: "GEN-1",
    title: "User Authentication System",
    description:
      "As a user, I want to be able to create an account and log in securely so that I can access personalized features.",
    type: "story",
    priority: "high",
    storyPoints: 8,
    acceptanceCriteria: [
      "User can register with email and password",
      "User can log in with valid credentials",
      "User receives appropriate error messages for invalid inputs",
      "User session is maintained across browser refreshes",
      "User can log out successfully",
    ],
    status: "generated",
  },
  {
    id: "GEN-2",
    title: "Dashboard Analytics Widget",
    description:
      "As a project manager, I want to see key metrics on my dashboard so that I can track project progress at a glance.",
    type: "story",
    priority: "medium",
    storyPoints: 5,
    acceptanceCriteria: [
      "Display total number of issues",
      "Show completion percentage",
      "Display issues by priority breakdown",
      "Show sprint progress indicator",
      "Update metrics in real-time",
    ],
    status: "generated",
  },
  {
    id: "GEN-3",
    title: "Mobile Responsive Design",
    description:
      "As a user, I want the application to work well on mobile devices so that I can manage tasks on the go.",
    type: "task",
    priority: "medium",
    storyPoints: 3,
    acceptanceCriteria: [
      "All pages are responsive on mobile devices",
      "Touch interactions work properly",
      "Text is readable without zooming",
      "Navigation is accessible on small screens",
      "Performance is optimized for mobile",
    ],
    status: "generated",
  },
  {
    id: "GEN-4",
    title: "Fix Memory Leak in Dashboard",
    description:
      "There is a memory leak occurring when users stay on the dashboard for extended periods, causing browser slowdown.",
    type: "bug",
    priority: "high",
    storyPoints: 3,
    acceptanceCriteria: [
      "Identify source of memory leak",
      "Implement proper cleanup of event listeners",
      "Test memory usage over extended periods",
      "Verify fix doesn't break existing functionality",
      "Add monitoring to prevent future leaks",
    ],
    status: "generated",
  },
  {
    id: "GEN-5",
    title: "Advanced Search Functionality",
    description:
      "As a user, I want to search for issues using multiple criteria so that I can quickly find specific items.",
    type: "story",
    priority: "low",
    storyPoints: 5,
    acceptanceCriteria: [
      "Search by title and description",
      "Filter by assignee, priority, and status",
      "Support date range filtering",
      "Save search preferences",
      "Export search results",
    ],
    status: "generated",
  },
]

// Pre-populated backlog stories
const initialBacklogStories: GeneratedStory[] = [
  {
    id: "BL-1",
    title: "Email Notification System",
    description:
      "As a team member, I want to receive email notifications for important updates so that I stay informed about project changes.",
    type: "story",
    priority: "medium",
    storyPoints: 8,
    acceptanceCriteria: [
      "Send notifications for issue assignments",
      "Notify on status changes",
      "Allow users to configure notification preferences",
      "Support email templates",
      "Include unsubscribe functionality",
    ],
    status: "in-backlog",
    assignedTo: "Alice Johnson",
  },
  {
    id: "BL-2",
    title: "Data Export Feature",
    description:
      "As a project manager, I want to export project data in various formats so that I can create reports for stakeholders.",
    type: "story",
    priority: "low",
    storyPoints: 5,
    acceptanceCriteria: [
      "Export to CSV format",
      "Export to PDF format",
      "Include filtering options",
      "Schedule automatic exports",
      "Email export results",
    ],
    status: "in-backlog",
    assignedTo: "Bob Wilson",
  },
]

// Pre-populated sprint stories
const initialSprintStories: GeneratedStory[] = [
  {
    id: "SP-1",
    title: "Real-time Collaboration",
    description:
      "As a team member, I want to see real-time updates when other team members make changes so that we can collaborate effectively.",
    type: "story",
    priority: "high",
    storyPoints: 13,
    acceptanceCriteria: [
      "Real-time updates using WebSockets",
      "Show who is currently viewing/editing",
      "Conflict resolution for simultaneous edits",
      "Offline support with sync",
      "Performance optimization for large teams",
    ],
    status: "in-sprint",
    assignedTo: "John Doe",
    sprint: "S-3",
  },
  {
    id: "SP-2",
    title: "Performance Optimization",
    description:
      "As a user, I want the application to load quickly and respond smoothly so that I can work efficiently.",
    type: "task",
    priority: "high",
    storyPoints: 8,
    acceptanceCriteria: [
      "Page load time under 2 seconds",
      "Optimize database queries",
      "Implement caching strategy",
      "Minimize bundle size",
      "Add performance monitoring",
    ],
    status: "in-sprint",
    assignedTo: "Charlie Brown",
    sprint: "S-4",
  },
]

export default function AssistantPage() {
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>(initialGeneratedStories)
  const [backlogStories, setBacklogStories] = useState<GeneratedStory[]>(initialBacklogStories)
  const [sprintStories, setSprintStories] = useState<GeneratedStory[]>(initialSprintStories)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedStory, setSelectedStory] = useState<GeneratedStory | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [assignmentTarget, setAssignmentTarget] = useState<"backlog" | "sprint">("backlog")
  const [draggedStory, setDraggedStory] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      setSelectedFile(file)
    }
  }

  const processAudioFile = () => {
    if (!selectedFile) return

    setIsProcessing(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const newStories: GeneratedStory[] = [
        {
          id: `GEN-${generatedStories.length + 1}`,
          title: "Meeting Action Item: API Integration",
          description:
            "As discussed in the meeting, we need to integrate with the third-party payment API to handle transactions.",
          type: "story",
          priority: "high",
          storyPoints: 8,
          acceptanceCriteria: [
            "Research payment API documentation",
            "Implement API integration",
            "Add error handling for API failures",
            "Test with sandbox environment",
            "Deploy to production",
          ],
          status: "generated",
        },
        {
          id: `GEN-${generatedStories.length + 2}`,
          title: "Meeting Action Item: User Feedback System",
          description:
            "Based on meeting discussion, implement a feedback system for users to report issues and suggestions.",
          type: "story",
          priority: "medium",
          storyPoints: 5,
          acceptanceCriteria: [
            "Create feedback form UI",
            "Set up backend to store feedback",
            "Add email notifications for new feedback",
            "Create admin dashboard to view feedback",
            "Implement feedback categorization",
          ],
          status: "generated",
        },
      ]

      setGeneratedStories([...newStories, ...generatedStories])
      setIsProcessing(false)
      setSelectedFile(null)
    }, 3000)
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, storyId: string, sourceColumn: string) => {
    setDraggedStory(storyId)
    e.dataTransfer.effectAllowed = "move"
    // Set both text/plain and application/json to ensure compatibility
    e.dataTransfer.setData("text/plain", JSON.stringify({ storyId, sourceColumn }))
    e.dataTransfer.setData("application/json", JSON.stringify({ storyId, sourceColumn }))
  }

  const handleDragEnd = () => {
    setDraggedStory(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(targetColumn)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Only clear if we're leaving the actual drop zone, not child elements
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault()
    try {
      // Try to get data from either format
      let data
      try {
        data = JSON.parse(e.dataTransfer.getData("application/json"))
      } catch {
        data = JSON.parse(e.dataTransfer.getData("text/plain"))
      }
      
      const { storyId, sourceColumn } = data

      if (sourceColumn === targetColumn) return

      // Find the story in the source column
      let story: GeneratedStory | undefined

      if (sourceColumn === "generated") {
        story = generatedStories.find((s) => s.id === storyId)
        if (story) {
          setGeneratedStories((prev) => prev.filter((s) => s.id !== storyId))
        }
      } else if (sourceColumn === "backlog") {
        story = backlogStories.find((s) => s.id === storyId)
        if (story) {
          setBacklogStories((prev) => prev.filter((s) => s.id !== storyId))
        }
      } else if (sourceColumn === "sprint") {
        story = sprintStories.find((s) => s.id === storyId)
        if (story) {
          setSprintStories((prev) => prev.filter((s) => s.id !== storyId))
        }
      }

      if (!story) return

      // Update story status and add to target column
      const updatedStory = {
        ...story,
        status: targetColumn === "generated" ? "generated" : targetColumn === "backlog" ? "in-backlog" : "in-sprint",
      } as GeneratedStory

      // Use a small timeout to ensure the visual feedback is smooth
      setTimeout(() => {
        if (targetColumn === "generated") {
          setGeneratedStories((prev) => [updatedStory, ...prev])
        } else if (targetColumn === "backlog") {
          setBacklogStories((prev) => [updatedStory, ...prev])
        } else if (targetColumn === "sprint") {
          // For sprint, we need to assign a sprint if not already assigned
          if (!updatedStory.sprint) {
            updatedStory.sprint = "S-3" // Default to active sprint
          }
          setSprintStories((prev) => [updatedStory, ...prev])
        }
      }, 50)
    } catch (error) {
      console.error("Error handling drop:", error)
    } finally {
      setDraggedStory(null)
      setDragOverColumn(null)
    }
  }

  const moveToBacklog = (story: GeneratedStory) => {
    setSelectedStory(story)
    setAssignmentTarget("backlog")
    setIsAssignDialogOpen(true)
  }

  const moveToSprint = (story: GeneratedStory) => {
    setSelectedStory(story)
    setAssignmentTarget("sprint")
    setIsAssignDialogOpen(true)
  }

  const confirmAssignment = (assignee?: string, sprint?: string) => {
    if (!selectedStory) return

    const updatedStory = {
      ...selectedStory,
      status: assignmentTarget === "backlog" ? ("in-backlog" as const) : ("in-sprint" as const),
      assignedTo: assignee,
      sprint: sprint,
    }

    // Remove from generated stories
    setGeneratedStories((prev) => prev.filter((story) => story.id !== selectedStory.id))

    // Add to target column
    if (assignmentTarget === "backlog") {
      setBacklogStories((prev) => [updatedStory, ...prev])
    } else {
      setSprintStories((prev) => [updatedStory, ...prev])
    }

    setIsAssignDialogOpen(false)
    setSelectedStory(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="w-4 h-4 text-red-500" />
      case "story":
        return <Circle className="w-4 h-4 text-blue-500" />
      case "task":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    const config = projectConfig.priorities.find((p) => p.id === priority)
    return config?.color || "bg-gray-500"
  }

  return (
    <div className="p-6 h-screen overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Bot className="w-6 h-6 mr-2 text-blue-600" />
            AI Assistant
          </h1>
          <p className="text-gray-500">Generate and manage user stories from meeting recordings</p>
        </div>
      </div>

      {/* Audio File Upload Section */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <FileAudio className="w-5 h-5 mr-2 text-purple-600" />
          Upload Meeting Recording
        </h2>
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <Button onClick={processAudioFile} disabled={isProcessing || !selectedFile}>
            <Upload className="w-4 h-4 mr-2" />
            {isProcessing ? "Processing..." : "Process Audio"}
          </Button>
        </div>
        {selectedFile && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Column 1: Generated Stories */}
        <div
          className={`bg-white rounded-lg border p-4 overflow-hidden flex flex-col transition-all duration-200 ${
            dragOverColumn === "generated" ? "ring-2 ring-blue-400 bg-blue-50" : ""
          }`}
          onDragOver={(e) => handleDragOver(e, "generated")}
          onDragLeave={(e) => handleDragLeave(e)}
          onDrop={(e) => handleDrop(e, "generated")}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Generated Stories</h3>
            <Badge variant="secondary">{generatedStories.length}</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {isProcessing && (
              <Card className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            )}

            {generatedStories.map((story) => (
              <Card
                key={story.id}
                draggable
                onDragStart={(e) => handleDragStart(e, story.id, "generated")}
                onDragEnd={handleDragEnd}
                className={`cursor-move hover:shadow-md transition-all duration-200 ${
                  draggedStory === story.id ? "opacity-50 rotate-2 scale-105" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(story.type)}
                      <span className="text-sm font-medium text-gray-600">{story.id}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GripVertical className="w-3 h-3 text-gray-400" />
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(story.priority)}`} />
                    </div>
                  </div>

                  <h5 className="font-medium mb-2">{story.title}</h5>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{story.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {story.storyPoints} pts
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {story.priority}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Button size="sm" className="w-full" onClick={() => moveToBacklog(story)}>
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Add to Backlog
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => moveToSprint(story)}>
                      <Calendar className="w-3 h-3 mr-1" />
                      Add to Sprint
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 2: Backlog Items */}
        <div
          className={`bg-gray-50 rounded-lg border p-4 overflow-hidden flex flex-col transition-all duration-200 ${
            dragOverColumn === "backlog" ? "ring-2 ring-blue-400 bg-blue-50" : ""
          }`}
          onDragOver={(e) => handleDragOver(e, "backlog")}
          onDragLeave={(e) => handleDragLeave(e)}
          onDrop={(e) => handleDrop(e, "backlog")}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Backlog</h3>
            <Badge variant="secondary">{backlogStories.length}</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {backlogStories.map((story) => (
              <Card
                key={story.id}
                draggable
                onDragStart={(e) => handleDragStart(e, story.id, "backlog")}
                onDragEnd={handleDragEnd}
                className={`bg-white cursor-move hover:shadow-md transition-all duration-200 ${
                  draggedStory === story.id ? "opacity-50 rotate-2 scale-105" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(story.type)}
                      <span className="text-sm font-medium text-gray-600">{story.id}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GripVertical className="w-3 h-3 text-gray-400" />
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        Backlog
                      </Badge>
                    </div>
                  </div>

                  <h5 className="font-medium mb-2">{story.title}</h5>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{story.description}</p>

                  {story.assignedTo && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {story.assignedTo
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{story.assignedTo}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {story.storyPoints} pts
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(story.priority)}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Column 3: Sprint Planning Items */}
        <div
          className={`bg-green-50 rounded-lg border p-4 overflow-hidden flex flex-col transition-all duration-200 ${
            dragOverColumn === "sprint" ? "ring-2 ring-blue-400 bg-blue-50" : ""
          }`}
          onDragOver={(e) => handleDragOver(e, "sprint")}
          onDragLeave={(e) => handleDragLeave(e)}
          onDrop={(e) => handleDrop(e, "sprint")}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Sprint Planning</h3>
            <Badge variant="secondary">{sprintStories.length}</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {sprintStories.map((story) => (
              <Card
                key={story.id}
                draggable
                onDragStart={(e) => handleDragStart(e, story.id, "sprint")}
                onDragEnd={handleDragEnd}
                className={`bg-white cursor-move hover:shadow-md transition-all duration-200 ${
                  draggedStory === story.id ? "opacity-50 rotate-2 scale-105" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(story.type)}
                      <span className="text-sm font-medium text-gray-600">{story.id}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GripVertical className="w-3 h-3 text-gray-400" />
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {story.sprint}
                      </Badge>
                    </div>
                  </div>

                  <h5 className="font-medium mb-2">{story.title}</h5>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{story.description}</p>

                  {story.assignedTo && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {story.assignedTo
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{story.assignedTo}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {story.storyPoints} pts
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(story.priority)}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to {assignmentTarget === "backlog" ? "Backlog" : "Sprint"}</DialogTitle>
            <DialogDescription>
              Assign this story to a team member{assignmentTarget === "sprint" ? " and sprint" : ""}.
            </DialogDescription>
          </DialogHeader>

          {selectedStory && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedStory.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedStory.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignee">Assignee (Optional)</Label>
                  <Select onValueChange={(value) => setSelectedStory({ ...selectedStory, assignedTo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {assignmentTarget === "sprint" && (
                  <div>
                    <Label htmlFor="sprint">Sprint</Label>
                    <Select onValueChange={(value) => setSelectedStory({ ...selectedStory, sprint: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sprint" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSprints.map((sprint) => (
                          <SelectItem key={sprint.id} value={sprint.id}>
                            {sprint.name} ({sprint.status})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => confirmAssignment(selectedStory?.assignedTo, selectedStory?.sprint)}>
              Add to {assignmentTarget === "backlog" ? "Backlog" : "Sprint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
