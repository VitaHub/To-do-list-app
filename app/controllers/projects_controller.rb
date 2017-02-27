class ProjectsController < ApplicationController
  before_action :set_project, only: [:destroy, :show, :update]

  def index
    @projects = current_user.projects.order("created_at DESC")
    render json: @projects
  end

  def show
    render json: @project
  end

  def create
    @project = current_user.projects.new(project_params)

    if @project.save
      render json: @project, status: :created, location: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @project.destroy
  end

  private

    def set_project
      @project = Project.find(params[:id])
      raise SecurityError, "Invalid user!" unless @project.user == current_user
    end

    def project_params
      params.require(:project).permit(:name)
    end
end