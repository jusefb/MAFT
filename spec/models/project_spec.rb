require 'spec_helper'

describe Project do

  it "has a valid factory" do
    expect(build(:project)).to be_valid
  end

  it "is invalid without a title" do
    expect(build(:project, title: nil)).to have(1).errors_on(:title)
  end

  it "is invalid without an owner" do
    expect(build(:project, owner: nil)).to have(1).errors_on(:owner)
  end

end