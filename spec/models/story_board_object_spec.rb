require 'spec_helper'

describe StoryBoardObject do

    it "has a valid factory" do
      expect(build(:story_board_object)).to be_valid
    end

    it "is invalid without a title" do
      expect(build(:story_board_object, title: nil)).to have(1).errors_on(:title)
    end

    it "is invalid without a type"  do
      expect(build(:story_board_object, type: nil)).to have(1).errors_on(:type)
    end

    it "is invalid without a project_id" do
      expect(build(:story_board_object, project_id: nil)).to have(1).errors_on(:project_id)
    end

    it "is invalid without a stage" do
      expect(build(:story_board_object, stage: nil)).to have(1).errors_on(:stage)
    end

    it "is invalid without an order" do
      expect(build(:story_board_object, obj_order: nil)).to have(1).errors_on(:obj_order)
    end

  it "has a valid story_board_object_type" do
    sb_object_types = StoryBoardObject.subclasses
    sb_object_types.map!{ |s| s.name  }
    sb_object_type = create(:valid_task).class.to_s

    expect(sb_object_types.include?(sb_object_type)).to be_true
  end

end
