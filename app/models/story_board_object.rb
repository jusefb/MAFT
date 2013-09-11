class StoryBoardObject < ActiveRecord::Base
  attr_accessible :title, :type, :description, :stage, :project_id, :obj_order, :parent_task_id, :status, :start_date, :end_date, :estimated_time, :marked_as_current_date

  belongs_to :project

  validates_presence_of :title, :type, :project_id, :stage, :obj_order

  #we extend the json conversion method to allow setting of the name of the parent task
  def as_json(options = {})
    json = super(options)
    parent = nil
    parent_title = ''

    parent = StoryBoardObject.find_by_id(parent_task_id) if(parent_task_id != nil)
    parent_title = parent['title'] if(parent != nil)
    #json['start_date'] = self.start_date.strftime('%:% %d/%m/%Y') if(self.start_date != nil)
    #json['end_date'] = self.end_date.strftime('%d/%m/%Y') if(self.end_date != nil)

    json['parent_title'] = parent_title
    json
  end

  def set_status_dates
    case self.status
    when 'Completed'
        self.end_date = Time.now
        self.stage = 'Done'
      when 'Started'
        self.start_date = Time.now
        self.stage = 'Backlog' if(self.stage != 'Current')
      when 'Not Started'
        self.start_date = nil
        #set the stage back to backlog if the tsk was marked as done
        self.stage = 'Backlog' if(self.stage == 'Done')
    end
  end

  def on_update_stage
    case self.stage
      when 'Current'
        self.marked_as_current_date = Time.now
      when 'Backlog' || 'Future'
        self.marked_as_current_date = nil
    end
  end
end

class Task < StoryBoardObject

end

class UserStory < StoryBoardObject

end

class TestTask < StoryBoardObject

end
