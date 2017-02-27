require 'rails_helper'

RSpec.describe TasksController, type: :controller do
  let(:user) { create(:user) }

  before(:each) { sign_in user }

  let(:own_project) { create(:project, user: user) }
  let(:other_project) { create(:project) }

  let(:own_task) {
    FactoryGirl.build(:task, project: own_project).attributes
  }

  let(:other_task) {
    FactoryGirl.build(:task, project: other_project).attributes
  }

  let(:invalid_task) {
    FactoryGirl.build(:task, project: own_project, name: "").attributes
  }

  describe "GET #index" do
    it "assigns only project tasks as @tasks" do
      task = Task.create! own_task
      Task.create! other_task
      get :index, params: { project_id: own_project.id }
      expect(response).to be_success
      expect(assigns(:tasks)).to eq([task])
    end

    it "fails if tasks project is not own" do
      task = Task.create! other_task
      expect {
        get :index, params: { project_id: task.project.id }
      }.to raise_error(SecurityError, "Invalid user!")
    end
  end

  describe "GET #show" do
    it "assigns the requested task as @task" do
      task = Task.create! own_task
      get :show, params: {project_id: own_project.id,
        id: task.id }
      expect(response).to be_success
      expect(assigns(:task)).to eq(task)
    end

    it "fails if tasks project is not own" do
      task = Task.create! other_task
      expect {
        get :show, params: {project_id: task.project.id,
          id: task.id }
      }.to raise_error(SecurityError, "Invalid user!")
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new Task" do
        expect {
          post :create, params: {project_id: own_project.id, 
            task: own_task }
        }.to change(Task, :count).by(1)
      end

      it "assigns a newly created task as @task" do
        post :create, params: {project_id: own_project.id, 
          task: own_task }
        expect(assigns(:task)).to be_a(Task)
        expect(assigns(:task)).to be_persisted
      end

      it "fails if tasks project is not own" do
        expect {
          post :create, params: {project_id: other_project.id, 
            task: other_task }
        }.to raise_error(SecurityError, "Invalid user!")
        expect(Task.count).to eq(0)
      end
    end

    context "with invalid params" do
      it "does not create a new Task" do
        expect {
          post :create, params: {project_id: own_project.id, 
            task: invalid_task }
        }.to change(Task, :count).by(0)
      end
    end
  end

  describe "PUT #update" do
    let(:new_task) {
      FactoryGirl.build(:task, project: own_project, 
        name: "Another New Task").attributes
    }

    context "with valid params" do
      it "updates the requested task" do
        task = Task.create! own_task
        put :update, params: {project_id: own_project.id, 
          id: task.id, task: new_task}
        expect(response).to be_success
        task.reload
        expect(assigns(:task).name).to eq("Another New Task")
      end

      it "fails if tasks project is not own" do
        task = Task.create! other_task
        expect {
          put :update, params: {project_id: task.project.id, 
            id: task.id, task: new_task }
        }.to raise_error(SecurityError, "Invalid user!")
      end
    end

    context "with invalid params" do
      it "does not update the requested task" do
        task = Task.create! own_task
        put :update, params: {project_id: task.project.id, 
          id: task.id, task: invalid_task}
        expect(assigns(:task).name).to eq("")
        expect(task.name).to match(/task/)
      end      
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested task" do
      task = Task.create! own_task
      expect {
        delete :destroy, params: { project_id: task.project.id, 
          id: task.id }
      }.to change(Task, :count).by(-1)
    end

    it "does not destroy the requested task if user invalid" do
      task = Task.create! other_task
      expect {
        delete :destroy, params: { project_id: task.project.id, 
          id: task.id }
      }.to raise_error(SecurityError, "Invalid user!")
      expect(Task.count).to eq(1)
    end
  end
end