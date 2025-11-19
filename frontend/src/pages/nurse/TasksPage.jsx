import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import tasksBg from "/assets/bg-nurse.jpg";
import nurseService from "../../services/nurseService";
import Button from "../../components/common/Button";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, completed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    nurseService.getTasks()
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTaskComplete = async (taskId) => {
    try {
      await nurseService.markTaskComplete(taskId);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: "completed" } : task
      ));
    } catch (error) {
      alert("Failed to mark task as complete");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Layout>
      <HeroSection
        bgImage={tasksBg}
        headline="My Tasks"
        subtext="Manage your daily nursing tasks and assignments"
      />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Filter Buttons */}
        <div className="mb-6 flex space-x-2">
          <Button
            variant={filter === "all" ? "primary" : "secondary"}
            onClick={() => setFilter("all")}
          >
            All Tasks ({tasks.length})
          </Button>
          <Button
            variant={filter === "pending" ? "primary" : "secondary"}
            onClick={() => setFilter("pending")}
          >
            Pending ({tasks.filter(t => t.status === "pending").length})
          </Button>
          <Button
            variant={filter === "completed" ? "primary" : "secondary"}
            onClick={() => setFilter("completed")}
          >
            Completed ({tasks.filter(t => t.status === "completed").length})
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2">Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-md border-l-4 border-indigo-500 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{task.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <p><strong>Patient:</strong> {task.patientName}</p>
                  <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}</p>
                  <p><strong>Assigned by:</strong> {task.assignedBy}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className={`px-3 py-1 text-sm rounded ${
                    task.status === "completed" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {task.status}
                  </span>
                  
                  {task.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleTaskComplete(task.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
                
                {task.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm"><strong>Notes:</strong> {task.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {filteredTasks.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found for the selected filter.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TasksPage;
