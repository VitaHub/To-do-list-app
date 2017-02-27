class TasksController < ApplicationController
  before_action :set_project
  before_action :set_task, only: [:show, :update, :destroy]

  def index
    @tasks = @project.tasks.order("created_at ASC")
    render json: @tasks
  end

  def show
    render json: @task
  end

  def create
    @task = @project.tasks.new(task_params)

    if @task.save
      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def update
    if params[:newTaskIndex]
      project = Project.find(params[:projectId])
      new_position = project.tasks.limit(1)
        .offset(params[:newTaskIndex])[0].position
      project.tasks.find(params[:taskId]).insert_at(new_position)

      render json: "reordered"
    else
      if @task.update(task_params)
        render json: @task
      else
        render json: @task.errors, status: :unprocessable_entity
      end
    end
  end

  def destroy
    @task.destroy
  end

  private

    def set_project
      @project = Project.find(params[:project_id])
      raise SecurityError, "Invalid user!" unless @project.user == current_user
    end

    def set_task
      @task = Task.find(params[:id])
    end

    def task_params
      params.require(:task).permit(:name, :done)
    end
end