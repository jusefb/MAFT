class HomeController < ApplicationController
  before_filter :authenticate_user!, except: ['index']

  def index

  end

  def main_show
    render partial: 'home/main_show'
  end
end
