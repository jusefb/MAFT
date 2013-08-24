# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user do
    id {1}
    name {'test user'}
    email  {"test@test.com"}
    password {"gikasha1234"}
    user_roles []
  end
end
