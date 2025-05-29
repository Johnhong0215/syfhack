"use client"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bug, Calendar, Circle, CheckCircle2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Centralized project configuration - easy to modify
const projectConfig = {
  name: "HackTracker",
  key: "HACK",
  description: "Hackathon Project Management",
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

// Sprint templates - easy to modify
const sprintConfig = {
  defaultDuration: 14, // days
  defaultStoryPoints: [1, 2, 3, 5, 8, 13],
  sprintGoals: [
    "Complete core authentication functionality",
    "Implement dashboard features",
    "Implement core features for MVP",
    "Plan and implement analytics",
    "Plan and implement advanced features",
  ],
}

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

interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "planning" | "active" | "completed"
  goal: string
}

// Generate sprint dates (2-week periods)
const generateSprintDates = (sprintCount: number) => {
  const sprints: Sprint[] = []
  const today = new Date()

  // Create past sprints
  for (let i = 2; i > 0; i--) {
    const endDate = new Date(today)
    endDate.setDate(endDate.getDate() - (i - 1) * 14)

    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 14)

    sprints.push({
      id: `S-${sprintCount - i + 1}`,
      name: `Sprint ${sprintCount - i + 1}`,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      status: "completed",
      goal: `Complete core ${sprintCount - i + 1 === 1 ? "authentication" : "dashboard"} functionality`,
    })
  }

  // Create current sprint
  const currentStartDate = new Date(today)
  currentStartDate.setDate(currentStartDate.getDate() - today.getDay())

  const currentEndDate = new Date(currentStartDate)
  currentEndDate.setDate(currentEndDate.getDate() + 13)

  sprints.push({
    id: `S-${sprintCount}`,
    name: `Sprint ${sprintCount}`,
    startDate: currentStartDate.toISOString().split("T")[0],
    endDate: currentEndDate.toISOString().split("T")[0],
    status: "active",
    goal: "Implement core features for MVP",
  })

  // Create future sprints
  for (let i = 1; i <= 2; i++) {
    const startDate = new Date(currentEndDate)
    startDate.setDate(startDate.getDate() + 1)

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 13)

    sprints.push({
      id: `S-${sprintCount + i}`,
      name: `Sprint ${sprintCount + i}`,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      status: "planning",
      goal: `Plan and implement ${sprintCount + i === 4 ? "analytics" : "advanced features"}`,
    })
  }

  return sprints
}

const initialSprints = generateSprintDates(3)

const initialIssues: Issue[] = [
  {
    id: "HACK-1",
    title: "Set up authentication system",
    description: "Implement user login and registration functionality",
    status: "in-progress",
    priority: "high",
    type: "story",
    assignee: "",
    reporter: "Jane Smith",
    created: "2024-01-15",
    sprint: "S-3",
    storyPoints: 5,
  },
  {
    id: "HACK-2",
    title: "Design landing page",
    description: "Create an attractive landing page for the application",
    status: "todo",
    priority: "medium",
    type: "task",
    assignee: "",
    reporter: "Bob Wilson",
    created: "2024-01-16",
    sprint: "S-3",
    storyPoints: 3,
  },
  {
    id: "HACK-3",
    title: "Fix mobile responsiveness",
    description: "Address layout issues on mobile devices",
    status: "review",
    priority: "high",
    type: "bug",
    assignee: "",
    reporter: "Diana Prince",
    created: "2024-01-14",
    sprint: "S-3",
    storyPoints: 2,
  },
  {
    id: "HACK-4",
    title: "Add dark mode support",
    description: "Implement dark mode toggle functionality",
    status: "done",
    priority: "low",
    type: "story",
    assignee: "",
    reporter: "Frank Miller",
    created: "2024-01-13",
    sprint: "S-2",
    storyPoints: 3,
  },
  {
    id: "HACK-5",
    title: "Implement user profile page",
    description: "Create a page where users can view and edit their profile information",
    status: "done",
    priority: "medium",
    type: "story",
    assignee: "",
    reporter: "Jane Smith",
    created: "2024-01-10",
    sprint: "S-2",
    storyPoints: 5,
  },
  {
    id: "HACK-6",
    title: "Set up CI/CD pipeline",
    description: "Configure continuous integration and deployment for the project",
    status: "done",
    priority: "high",
    type: "task",
    assignee: "",
    reporter: "Bob Wilson",
    created: "2024-01-09",
    sprint: "S-1",
    storyPoints: 8,
  },
  {
    id: "HACK-7",
    title: "Create database schema",
    description: "Design and implement the initial database schema",
    status: "done",
    priority: "high",
    type: "story",
    assignee: "",
    reporter: "Diana Prince",
    created: "2024-01-08",
    sprint: "S-1",
    storyPoints: 5,
  },
  {
    id: "HACK-8",
    title: "Implement analytics dashboard",
    description: "Create a dashboard to display user analytics and metrics",
    status: "todo",
    priority: "medium",
    type: "story",
    assignee: "",
    reporter: "Frank Miller",
    created: "2024-01-20",
    sprint: "S-4",
    storyPoints: 8,
  },
  {
    id: "HACK-9",
    title: "Add export functionality",
    description: "Allow users to export data in various formats",
    status: "todo",
    priority: "low",
    type: "story",
    assignee: "",
    reporter: "Jane Smith",
    created: "2024-01-21",
    sprint: "S-4",
    storyPoints: 5,
  },
  {
    id: "HACK-10",
    title: "Implement real-time notifications",
    description: "Add WebSocket support for real-time notifications",
    status: "todo",
    priority: "medium",
    type: "story",
    assignee: "",
    reporter: "Bob Wilson",
    created: "2024-01-22",
    sprint: "S-5",
    storyPoints: 8,
  },
]

export default function BacklogPage() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues)
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    type: "story" as const,
    priority: "medium" as const,
    sprint: sprints[2].id,
    storyPoints: 3,
    assignee: "unassigned",
  })

  const createIssue = () => {
    const issue: Issue = {
      id: `${projectConfig.key}-${issues.length + 1}`,
      title: newIssue.title,
      description: newIssue.description,
      status: "todo",
      priority: newIssue.priority,
      type: newIssue.type,
      assignee: newIssue.assignee === "unassigned" ? "" : newIssue.assignee,
      reporter: "Current User",
      created: new Date().toISOString().split("T")[0],
      sprint: newIssue.sprint,
      storyPoints: newIssue.storyPoints,
    }
    setIssues([...issues, issue])
    setNewIssue({
      title: "",
      description: "",
      type: "story",
      priority: "medium",
      sprint: sprints[2].id,
      storyPoints: 3,
      assignee: "unassigned",
    })
    setIsCreateDialogOpen(false)
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

  const getSprintProgress = (sprintId: string) => {
    const sprintIssues = issues.filter((issue) => issue.sprint === sprintId)
    if (sprintIssues.length === 0) return 0

    const doneIssues = sprintIssues.filter((issue) => issue.status === "done")
    return Math.round((doneIssues.length / sprintIssues.length) * 100)
  }

  const getTotalStoryPoints = (sprintId: string) => {
    return issues
      .filter((issue) => issue.sprint === sprintId)
      .reduce((total, issue) => total + (issue.storyPoints || 0), 0)
  }

  const getSprintStatusBadge = (status: string) => {
    switch (status) {
      case "planning":
        return (
          <Badge variant="outline" className="bg-gray-100">
            Planning
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const assignIssueToUser = (issueId: string, assignee: string) => {
    const finalAssignee = assignee === "unassigned" ? "" : assignee
    setIssues((prevIssues) =>
      prevIssues.map((issue) => (issue.id === issueId ? { ...issue, assignee: finalAssignee } : issue)),
    )
  }

  const moveIssueToSprint = (issueId: string, sprintId: string) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) => (issue.id === issueId ? { ...issue, sprint: sprintId } : issue)),
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Backlog</h1>
          <p className="text-gray-500">Manage your sprints and stories</p>
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
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
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
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sprint">Sprint</Label>
                  <Select
                    value={newIssue.sprint}
                    onValueChange={(value: any) => setNewIssue({ ...newIssue, sprint: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={newIssue.sprint} />
                    </SelectTrigger>
                    <SelectContent>
                      {sprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.id}>
                          {sprint.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storyPoints">Story Points</Label>
                  <Select
                    value={newIssue.storyPoints.toString()}
                    onValueChange={(value: any) => setNewIssue({ ...newIssue, storyPoints: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={newIssue.storyPoints.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="13">13</SelectItem>
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
      </div>

      <Tabs defaultValue="sprints" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
          <TabsTrigger value="backlog">Backlog</TabsTrigger>
        </TabsList>

        <TabsContent value="sprints">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Sprint Planning</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            <Accordion type="multiple" defaultValue={["S-3"]}>
              {sprints.map((sprint) => (
                <AccordionItem key={sprint.id} value={sprint.id}>
                  <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-left">{sprint.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {sprint.startDate} to {sprint.endDate}
                            </span>
                          </div>
                        </div>
                        {getSprintStatusBadge(sprint.status)}
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {issues.filter((issue) => issue.sprint === sprint.id).length} issues
                          </div>
                          <div className="text-sm text-gray-500">{getTotalStoryPoints(sprint.id)} story points</div>
                        </div>
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{getSprintProgress(sprint.id)}%</span>
                          </div>
                          <Progress value={getSprintProgress(sprint.id)} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pr-4 pt-2">
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <h4 className="font-medium mb-1">Sprint Goal</h4>
                        <p className="text-sm text-gray-600">{sprint.goal}</p>
                      </div>

                      <div className="space-y-3">
                        {issues
                          .filter((issue) => issue.sprint === sprint.id)
                          .map((issue) => (
                            <Card key={issue.id} className="hover:shadow-sm transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div className="pt-1">{getTypeIcon(issue.type)}</div>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-600">{issue.id}</span>
                                        <Badge variant={issue.status === "done" ? "default" : "outline"}>
                                          {issue.status}
                                        </Badge>
                                      </div>
                                      <h5 className="font-medium mt-1">{issue.title}</h5>
                                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Badge variant="outline" className="bg-blue-50">
                                      {issue.storyPoints} pts
                                    </Badge>
                                    {issue.assignee ? (
                                      <Select
                                        value={issue.assignee || "unassigned"}
                                        onValueChange={(value) => assignIssueToUser(issue.id, value)}
                                      >
                                        <SelectTrigger className="w-[120px] h-7">
                                          <SelectValue>
                                            <div className="flex items-center space-x-1">
                                              <Avatar className="h-5 w-5">
                                                <AvatarFallback className="text-xs">
                                                  {issue.assignee
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                                </AvatarFallback>
                                              </Avatar>
                                              <span className="text-xs">{issue.assignee.split(" ")[0]}</span>
                                            </div>
                                          </SelectValue>
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
                                    ) : (
                                      <Select
                                        value={issue.assignee || "unassigned"}
                                        onValueChange={(value) => assignIssueToUser(issue.id, value)}
                                      >
                                        <SelectTrigger className="w-[120px] h-7">
                                          <SelectValue placeholder="Assign" />
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
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="backlog">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Backlog Items</h2>
            <p className="text-gray-500 mb-6">
              These items are not yet assigned to any sprint. Drag them into a sprint to schedule them.
            </p>

            <div className="space-y-3">
              {issues
                .filter((issue) => !issue.sprint)
                .map((issue) => (
                  <Card key={issue.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="pt-1">{getTypeIcon(issue.type)}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-600">{issue.id}</span>
                            </div>
                            <h5 className="font-medium mt-1">{issue.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                          </div>
                        </div>
                        <div>
                          <Select>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Add to sprint..." />
                            </SelectTrigger>
                            <SelectContent>
                              {sprints.map((sprint) => (
                                <SelectItem key={sprint.id} value={sprint.id}>
                                  {sprint.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {issues.filter((issue) => !issue.sprint).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items in backlog. Create a new issue to add it here.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
