require 'spec_helper'
# spec/features/widget_management_spec.rb
feature "Project management", :integration_test => true do
  #before do
  #  #we need to load the fixtures required for this feature before loading the tests
  #end

  scenario "view all projects" do
    visit root_url
    click_link "Projects"

    expect(page).to have_selector("#project-index")
  end

  scenario "access story_board of the project from the projects page" do
    project = create(:project)

    visit root_url
    click_link "Projects"

    click_link('goto-sb-' + project.id.to_s)
  end
end