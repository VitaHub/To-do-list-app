require 'rails_helper'

RSpec.describe Project, type: :model do
  it "should be created" do
    create(:project)
    expect(Project.count).to eq(1)
  end

  describe "ActiveModel validations" do
    let(:project) { create(:project) }

    it { expect(project).to validate_presence_of(:name) }
    it { expect(project).to validate_presence_of(:user_id) }
  end

  describe "ActiveRecord associations" do
    let(:project) { create(:project) }

    it { expect(project).to belong_to(:user) }
    it { expect(project).to have_many(:tasks) }
  end
end