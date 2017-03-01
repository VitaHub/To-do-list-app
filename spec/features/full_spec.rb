require 'rails_helper'

feature "Simple TODO App" do
  let(:email) { "test@example.com" }
  let(:password) { "password88" }
  before do
    User.create!(email: email,
      password: password,
      password_confirmation: password)
  end

  scenario "is working properly" do
    visit root_path

    # Check that we redirected to sign in page
    expect(page).to have_content("Sign in")
    expect(page).not_to have_content("Logout")

    # Log In
    fill_in "user[email]", with: email
    fill_in "user[password]", with: password
    click_button "Log in"

    # Check that we go to the right page
    expect(page).to have_content("Logout")
    expect(page).to have_selector("button.btn.add-todo-btn")

    # Adding a new TODO list
    expect(page.all("div.todo").count).to eq(0)
    click_button "Add TODO List"
    within "#project-modal" do
      fill_in "name", with: "New project"
      click_button "Add TODO list"
    end
    expect(page).to have_content("New project")
    expect(page.all("div.todo").count).to eq(1)

    # Adding new tasks to list
    within page.all("div.todo")[0] do
      (1..3).each do |n|
        fill_in "name", with: "Task 0#{n}"
        click_button "Add Task"
        expect(page).to have_content("Task 0#{n}")
      end
      expect(page.all(".tasks .item").count).to eq(3)
    end

    # Editing todo list
    within page.all("div.todo")[0] do
      page.find("section.project").tap(&:hover).find(".project-controls div.edit").click
    end
    within "#project-modal" do
      fill_in "name", with: "Edited project"
      click_button "Save TODO list"
    end
    expect(page).to have_content("Edited project")

    # Editing first task
    within ".tasks" do
      page.all(".item")[0].find("span.task").click
    end
    within "#task-modal" do
      fill_in "name", with: "Edited task"
      click_button "Save Task"
    end
    expect(page).to have_content("Edited task")

    # Deleting third task
    within ".tasks" do
      accept_confirm do
        page.all(".item")[2].tap(&:hover).find("div.delete").click
      end
    end  
    expect(page).not_to have_content("Task 03")
    expect(page.all(".tasks .item").count).to eq(2)

    # Prioritizing tasks
    # page.all(".tasks .item")[0].tap(&:hover).find("i.prioritize").drag_by(-40, 60)
    # within page.all(".tasks .item")[0] do
    #   expect(page).to have_content("Task 02")
    # end

    # Deleting TODO list
    within page.all("div.todo")[0] do
      accept_confirm do
        page.find("section.project").tap(&:hover)
          .find(".project-controls div.delete").click
      end
    end
    expect(page).not_to have_content("Edited project")
    expect(page.all("div.todo").count).to eq(0)

    # Log out
    click_link("Logout")

    # Check that we redirected to sign in page
    expect(page).to have_content("Sign in")
    expect(page).not_to have_content("Logout")  

  end
end