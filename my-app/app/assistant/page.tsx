"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Bot, Bug, Calendar, CheckCircle2, Circle, Upload, FileAudio, GripVertical, Loader2, MoreHorizontal, Edit3, Check, X } from "lucide-react"

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
  statusColumns: [
    { id: "todo", title: "To Do", status: "todo", color: "bg-gray-100" },
    { id: "in-progress", title: "In Progress", status: "in-progress", color: "bg-blue-100" },
    { id: "review", title: "Review", status: "review", color: "bg-yellow-100" },
    { id: "done", title: "Done", status: "done", color: "bg-green-100" },
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
  storyPoints?: number
  acceptanceCriteria: string[]
  status: "generated" | "in-backlog" | "in-sprint"
  assignedTo?: string
  sprint?: string
}

interface KanbanIssue {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "critical"
  type: "story" | "bug" | "task"
  assignee?: string
  reporter: string
  created: string
  sprint?: string
  storyPoints?: number
  acceptanceCriteria?: string[]
}

export default function AssistantPage() {
  // Initialize with empty arrays
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([])
  const [backlogStories, setBacklogStories] = useState<GeneratedStory[]>([])
  const [sprintStories, setSprintStories] = useState<GeneratedStory[]>([])
  
  // Kanban board state
  const [kanbanIssues, setKanbanIssues] = useState<KanbanIssue[]>([])
  const [kanbanDraggedIssue, setKanbanDraggedIssue] = useState<string | null>(null)
  const [kanbanDragOverColumn, setKanbanDragOverColumn] = useState<string | null>(null)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedStory, setSelectedStory] = useState<GeneratedStory | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [assignmentTarget, setAssignmentTarget] = useState<"backlog" | "sprint">("backlog")
  const [draggedStory, setDraggedStory] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  
  // Finalize functionality
  const [hasProcessedAudio, setHasProcessedAudio] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [finalizeProgress, setFinalizeProgress] = useState(0)
  const [finalizeStage, setFinalizeStage] = useState("")
  const [isFinalized, setIsFinalized] = useState(false)
  
  // Edit functionality
  const [editingIssue, setEditingIssue] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<KanbanIssue>>({})

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      setSelectedFile(file)
    }
  }

  const processAudioFile = () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setLoadingProgress(0)
    setLoadingStage("Analyzing audio file...")

    // Simulate progressive loading with different stages
    const stages = [
      { progress: 20, text: "Transcribing audio to text..." },
      { progress: 40, text: "Identifying key discussion points..." },
      { progress: 60, text: "Extracting user stories and requirements..." },
      { progress: 80, text: "Generating acceptance criteria..." },
      { progress: 100, text: "Finalizing story details..." }
    ]

    let currentStage = 0
    const progressInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setLoadingProgress(stages[currentStage].progress)
        setLoadingStage(stages[currentStage].text)
        currentStage++
      } else {
        clearInterval(progressInterval)
        
        // Generate new stories without story points or assigned users
        const newStories: GeneratedStory[] = [
          {
            id: `GEN-${Date.now()}-1`,
            title: "User Authentication System",
            description:
              "As a user, I want to be able to create an account and log in securely so that I can access personalized features.",
            type: "story",
            priority: "high",
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
            id: `GEN-${Date.now()}-2`,
            title: "Dashboard Analytics Widget",
            description:
              "As a project manager, I want to see key metrics on my dashboard so that I can track project progress at a glance.",
            type: "story",
            priority: "medium",
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
            id: `GEN-${Date.now()}-3`,
            title: "Mobile Responsive Design",
            description:
              "As a user, I want the application to work well on mobile devices so that I can manage tasks on the go.",
            type: "task",
            priority: "medium",
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
            id: `GEN-${Date.now()}-4`,
            title: "Fix Memory Leak in Dashboard",
            description:
              "There is a memory leak occurring when users stay on the dashboard for extended periods, causing browser slowdown.",
            type: "bug",
            priority: "high",
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
            id: `GEN-${Date.now()}-5`,
            title: "Advanced Search Functionality",
            description:
              "As a user, I want to search for issues using multiple criteria so that I can quickly find specific items.",
            type: "story",
            priority: "low",
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

        setGeneratedStories(newStories)
        setIsProcessing(false)
        setSelectedFile(null)
        setHasProcessedAudio(true)
      }
    }, 600) // 600ms per stage for smooth progression
  }

  const handleFinalize = () => {
    setIsFinalizing(true)
    setFinalizeProgress(0)
    setFinalizeStage("Preparing sprint stories...")

    const finalizeStages = [
      { progress: 25, text: "Converting stories to kanban issues..." },
      { progress: 50, text: "Assigning team members..." },
      { progress: 75, text: "Moving stories to kanban board..." },
      { progress: 100, text: "Finalizing project setup..." }
    ]

    let currentStage = 0
    const finalizeInterval = setInterval(() => {
      if (currentStage < finalizeStages.length) {
        setFinalizeProgress(finalizeStages[currentStage].progress)
        setFinalizeStage(finalizeStages[currentStage].text)
        currentStage++
      } else {
        clearInterval(finalizeInterval)
        
        // Function to randomly assign team members with better distribution
        const assignTeamMembers = (stories: GeneratedStory[]) => {
          const assignments: string[] = []
          const storyPointOptions = [1, 2, 3, 5, 8, 13] // Fibonacci sequence for story points
          
          stories.forEach((story, index) => {
            // Use round-robin with some randomness for better distribution
            const baseIndex = index % teamMembers.length
            const randomOffset = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
            const finalIndex = Math.max(0, Math.min(teamMembers.length - 1, baseIndex + randomOffset))
            
            assignments.push(teamMembers[finalIndex].name)
          })
          
          return assignments
        }

        // Function to assign realistic story points based on issue type and complexity
        const assignStoryPoints = (story: GeneratedStory) => {
          if (story.storyPoints) return story.storyPoints
          
          // Assign points based on type and some randomness
          const basePoints = {
            'bug': [1, 2, 3], // Bugs are usually smaller
            'task': [2, 3, 5], // Tasks are medium
            'story': [3, 5, 8, 13] // Stories can be larger
          }
          
          const options = basePoints[story.type] || [3, 5, 8]
          const randomIndex = Math.floor(Math.random() * options.length)
          return options[randomIndex]
        }

        // Get assignments for all sprint stories
        const assignments = assignTeamMembers(sprintStories)
        
        // Convert sprint stories to kanban issues and move to "To Do" column
        const kanbanIssuesFromSprint: KanbanIssue[] = sprintStories.map((story, index) => ({
          id: story.id.replace('GEN-', 'HACK-'),
          title: story.title,
          description: story.description,
          status: "todo" as const,
          priority: story.priority,
          type: story.type,
          assignee: assignments[index], // Assign the distributed team member
          reporter: "AI Assistant",
          created: new Date().toISOString().split("T")[0],
          sprint: story.sprint,
          storyPoints: assignStoryPoints(story), // Assign realistic story points
          acceptanceCriteria: story.acceptanceCriteria,
        }))

        // Clear all assistant columns and move to kanban
        setGeneratedStories([])
        setBacklogStories([])
        setSprintStories([])
        setKanbanIssues(kanbanIssuesFromSprint)
        
        setIsFinalizing(false)
        setIsFinalized(true)
      }
    }, 800) // 800ms per stage for finalize process
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

  // Kanban drag and drop handlers
  const handleKanbanDragStart = (e: React.DragEvent, issueId: string) => {
    setKanbanDraggedIssue(issueId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", issueId)
  }

  const handleKanbanDragEnd = () => {
    setKanbanDraggedIssue(null)
    setKanbanDragOverColumn(null)
  }

  const handleKanbanDragOver = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setKanbanDragOverColumn(targetStatus)
  }

  const handleKanbanDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setKanbanDragOverColumn(null)
    }
  }

  const handleKanbanDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()
    const issueId = e.dataTransfer.getData("text/plain")
    
    setKanbanIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: targetStatus as KanbanIssue["status"] }
          : issue
      )
    )
    
    setKanbanDraggedIssue(null)
    setKanbanDragOverColumn(null)
  }

  // Edit functionality
  const startEditing = (issue: KanbanIssue) => {
    setEditingIssue(issue.id)
    setEditFormData(issue)
  }

  const cancelEditing = () => {
    setEditingIssue(null)
    setEditFormData({})
  }

  const saveEdit = () => {
    if (!editingIssue || !editFormData) return
    
    setKanbanIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === editingIssue
          ? { ...issue, ...editFormData }
          : issue
      )
    )
    
    setEditingIssue(null)
    setEditFormData({})
  }

  return (
    <div className="p-6 min-h-screen overflow-auto">
      {/* Loading Screen Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Processing Audio File</h3>
              <p className="text-gray-600 mb-6">{loadingStage}</p>
              <Progress value={loadingProgress} className="w-full mb-2" />
              <p className="text-sm text-gray-500">{loadingProgress}% complete</p>
            </div>
          </div>
        </div>
      )}

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
              disabled={isProcessing}
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

      {/* Three Column Layout - Only show if not finalized */}
      {!isFinalized && (
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-300px)] mb-8">
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
              {generatedStories.length === 0 && !isProcessing && (
                <div className="text-center py-8 text-gray-500">
                  <FileAudio className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Upload an audio file to generate stories</p>
                </div>
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
                        {story.storyPoints ? `${story.storyPoints} pts` : "Unestimated"}
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
              {backlogStories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Circle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No items in backlog</p>
                </div>
              )}

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
                        {story.storyPoints ? `${story.storyPoints} pts` : "Unestimated"}
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
              {sprintStories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No items in sprint</p>
                </div>
              )}

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
                        {story.storyPoints ? `${story.storyPoints} pts` : "Unestimated"}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(story.priority)}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finalize Loading Screen Overlay */}
      {isFinalizing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Finalizing Project</h3>
              <p className="text-gray-600 mb-6">{finalizeStage}</p>
              <Progress value={finalizeProgress} className="w-full mb-2" />
              <p className="text-sm text-gray-500">{finalizeProgress}% complete</p>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board - Only show after finalization */}
      {isFinalized && (
        <div className="mt-8 border-t pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Sprint Board</h2>
            <Badge variant="secondary">{kanbanIssues.length} issues</Badge>
          </div>

          <div className="grid grid-cols-4 gap-6 h-[600px]">
            {projectConfig.statusColumns.map((column) => (
              <div
                key={column.id}
                className={`${column.color} rounded-lg p-4 transition-all duration-200 ${
                  kanbanDragOverColumn === column.status ? "ring-2 ring-blue-400 bg-blue-50" : ""
                }`}
                onDragOver={(e) => handleKanbanDragOver(e, column.status)}
                onDragLeave={handleKanbanDragLeave}
                onDrop={(e) => handleKanbanDrop(e, column.status)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-700">{column.title}</h4>
                  <Badge variant="secondary">
                    {kanbanIssues.filter((issue) => issue.status === column.status).length}
                  </Badge>
                </div>

                <div className="space-y-3 min-h-[500px] overflow-y-auto">
                  {kanbanIssues
                    .filter((issue) => issue.status === column.status)
                    .map((issue) => (
                      <Card
                        key={issue.id}
                        draggable={editingIssue !== issue.id}
                        onDragStart={(e) => handleKanbanDragStart(e, issue.id)}
                        onDragEnd={handleKanbanDragEnd}
                        className={`group ${editingIssue === issue.id ? 'cursor-default' : 'cursor-move'} hover:shadow-md transition-all duration-200 ${
                          kanbanDraggedIssue === issue.id ? "opacity-50 rotate-2 scale-105" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          {editingIssue === issue.id ? (
                            <div className="space-y-4">
                              {/* Title */}
                              <div>
                                <Label className="text-sm font-medium">Title</Label>
                                <Input
                                  value={editFormData.title || ""}
                                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                  className="font-medium"
                                  placeholder="Enter issue title"
                                />
                              </div>

                              {/* Description */}
                              <div>
                                <Label className="text-sm font-medium">Description</Label>
                                <Textarea
                                  value={editFormData.description || ""}
                                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                  className="text-sm"
                                  rows={3}
                                  placeholder="Enter issue description"
                                />
                              </div>

                              {/* Type and Priority Row */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-sm font-medium">Type</Label>
                                  <Select 
                                    value={editFormData.type || "story"} 
                                    onValueChange={(value) => setEditFormData({ ...editFormData, type: value as KanbanIssue["type"] })}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="story">
                                        <div className="flex items-center space-x-2">
                                          <Circle className="w-3 h-3 text-blue-500" />
                                          <span>Story</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="bug">
                                        <div className="flex items-center space-x-2">
                                          <Bug className="w-3 h-3 text-red-500" />
                                          <span>Bug</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="task">
                                        <div className="flex items-center space-x-2">
                                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                                          <span>Task</span>
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Priority</Label>
                                  <Select 
                                    value={editFormData.priority || "medium"} 
                                    onValueChange={(value) => setEditFormData({ ...editFormData, priority: value as KanbanIssue["priority"] })}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-2 h-2 rounded-full bg-green-500" />
                                          <span>Low</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="medium">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                          <span>Medium</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="high">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                                          <span>High</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="critical">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-2 h-2 rounded-full bg-red-500" />
                                          <span>Critical</span>
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Assignee and Story Points Row */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-sm font-medium">Assignee</Label>
                                  <Select 
                                    value={editFormData.assignee || "unassigned"} 
                                    onValueChange={(value) => setEditFormData({ ...editFormData, assignee: value === "unassigned" ? undefined : value })}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unassigned">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-xs text-gray-600">?</span>
                                          </div>
                                          <span>Unassigned</span>
                                        </div>
                                      </SelectItem>
                                      {teamMembers.map((member) => (
                                        <SelectItem key={member.id} value={member.name}>
                                          <div className="flex items-center space-x-2">
                                            <Avatar className="h-4 w-4">
                                              <AvatarFallback className="text-xs">
                                                {member.name.split(" ").map((n) => n[0]).join("")}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span>{member.name}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Story Points</Label>
                                  <Select 
                                    value={editFormData.storyPoints?.toString() || "unestimated"} 
                                    onValueChange={(value) => setEditFormData({ 
                                      ...editFormData, 
                                      storyPoints: value === "unestimated" ? undefined : parseInt(value)
                                    })}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unestimated">Unestimated</SelectItem>
                                      <SelectItem value="1">1 point</SelectItem>
                                      <SelectItem value="2">2 points</SelectItem>
                                      <SelectItem value="3">3 points</SelectItem>
                                      <SelectItem value="5">5 points</SelectItem>
                                      <SelectItem value="8">8 points</SelectItem>
                                      <SelectItem value="13">13 points</SelectItem>
                                      <SelectItem value="21">21 points</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Sprint Assignment */}
                              <div>
                                <Label className="text-sm font-medium">Sprint</Label>
                                <Select 
                                  value={editFormData.sprint || "none"} 
                                  onValueChange={(value) => setEditFormData({ ...editFormData, sprint: value === "none" ? undefined : value })}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">No sprint</SelectItem>
                                    {availableSprints.map((sprint) => (
                                      <SelectItem key={sprint.id} value={sprint.id}>
                                        {sprint.name} ({sprint.status})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Acceptance Criteria */}
                              {editFormData.acceptanceCriteria && editFormData.acceptanceCriteria.length > 0 && (
                                <div>
                                  <Label className="text-sm font-medium">Acceptance Criteria</Label>
                                  <div className="space-y-2 max-h-24 overflow-y-auto">
                                    {editFormData.acceptanceCriteria.map((criteria, index) => (
                                      <div key={index} className="flex items-start space-x-2 text-xs">
                                        <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-600">{criteria}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex items-center space-x-2 pt-2 border-t">
                                <Button size="sm" onClick={saveEdit} className="flex-1">
                                  <Check className="w-3 h-3 mr-1" />
                                  Save Changes
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEditing} className="flex-1">
                                  <X className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  {getTypeIcon(issue.type)}
                                  <span className="text-sm font-medium text-gray-600">{issue.id}</span>
                                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(issue.priority)}`} />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditing(issue)}
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Edit issue"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                  <GripVertical className="w-3 h-3 text-gray-400" />
                                </div>
                              </div>

                              <h5 className="font-medium mb-2 text-gray-900 leading-tight">{issue.title}</h5>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{issue.description}</p>

                              {/* Issue Details */}
                              <div className="space-y-2 mb-3">
                                {/* Priority and Type */}
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-gray-500">Priority:</span>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {issue.priority}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-gray-500">Type:</span>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {issue.type}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Story Points and Sprint */}
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-gray-500">Points:</span>
                                    <Badge variant="outline" className="text-xs">
                                      {issue.storyPoints ? `${issue.storyPoints}` : "?"}
                                    </Badge>
                                  </div>
                                  {issue.sprint && (
                                    <div className="flex items-center space-x-1">
                                      <span className="text-gray-500">Sprint:</span>
                                      <Badge variant="outline" className="text-xs">
                                        {issue.sprint}
                                      </Badge>
                                    </div>
                                  )}
                                </div>

                                {/* Reporter */}
                                <div className="text-xs text-gray-500">
                                  <span>Reporter: {issue.reporter}</span>
                                </div>
                              </div>

                              {/* Assignee and Actions */}
                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center space-x-2">
                                  {issue.assignee ? (
                                    <>
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">
                                          {issue.assignee
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs text-gray-600">{issue.assignee}</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">?</span>
                                      </div>
                                      <span className="text-xs text-gray-500">Unassigned</span>
                                    </>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {issue.created}
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finalize Button - Fixed at bottom right, only show after audio processed */}
      {hasProcessedAudio && !isFinalized && (
        <Button
          onClick={handleFinalize}
          disabled={isFinalizing || sprintStories.length === 0}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white shadow-lg z-40"
          size="lg"
        >
          {isFinalizing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Finalizing...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Finalize Project
            </>
          )}
        </Button>
      )}

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
