# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :story_board_object do
    title { "Task 1" }
    type {"Task"}
    description { "some task description"}
    stage {"Current"}
    obj_order {1}
    project_id {1}
    start_date {DateTime.now}
    end_date {DateTime.now + 30.days}

    factory :valid_task, :class => "Task" do
      title { "Task 1" }
      description { "some task description"}
      stage {"Backlog"}
      project
    end

    factory :valid_user_story, :class => "UserStory" do
      title { "User Story 1" }
      type { "UserStory" }
      description { "some user story description"}
      stage {"Future"}
      project
    end

    factory :invalid_story_board_object do
      title { nil }
    end
  end
end

valid_form_objects = {
    types: ['Task', 'UserStory'],
    stages: ['Future', 'Current', 'Backlog']
}
