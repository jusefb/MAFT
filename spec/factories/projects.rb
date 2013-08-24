# Read about factories at https://github.com/thoughtbot/factory_girl
require 'faker'

FactoryGirl.define do
  factory :project do
    id {Faker::object_id}
    title { Faker::Name.title }
    owner { Faker::Name.first_name + Faker::Name.last_name }
    description { "some project description"}
    start_date {DateTime.now}
    end_date {DateTime.now + 30.days}

    factory :invalid_project do
      title nil
    end
  end
end