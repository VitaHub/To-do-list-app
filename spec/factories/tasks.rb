FactoryGirl.define do
  factory :task do
    name "New task"
    done false
    sequence(:position) { |n| n }
    project
  end
end