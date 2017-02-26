require 'rails_helper'

RSpec.describe User, type: :model do
  it "should be created" do
    create(:user)
    expect(User.count).to eq(1)
  end

  it "should not be created without password" do
    expect {
      create(:user, password: "")
    }.to raise_error(ActiveRecord::RecordInvalid, 
      "Validation failed: Password can't be blank")
    expect(User.count).to eq(0)
  end 

  describe "ActiveModel validations" do
    let(:user) { create(:user) }

    it { expect(user).to validate_presence_of(:email) }
    it { expect(user).to validate_uniqueness_of(:email).ignoring_case_sensitivity }
  end

  describe "ActiveRecord associations" do
    let(:user) { create(:user) }

    it { expect(user).to have_many(:projects) }
  end
end