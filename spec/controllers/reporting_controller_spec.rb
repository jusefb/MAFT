require 'spec_helper'

describe ReportingController do

  before :each do
    login_user
  end

  describe "GET 'index'" do
    it "returns http success" do
      get 'index'
      response.should be_success
    end
  end

  describe "POST 'get_report_data'" do
    def make_the_request
      @start_date = '2013-08-14'
      @end_date = '2013-08-21'
      post :get_report_data, start_date: @start_date, end_date: @end_date
    end

    before :each do

    end

    it "sets the start and end date of the report" do
      make_the_request

      expect(assigns(:date1)).to eq Date.parse(@start_date)
      expect(assigns(:date2)).to eq Date.parse(@end_date)
    end

    it "sets the correct number of ticks" do
      make_the_request

      expect(assigns(:date_period).length).to eq 8
    end

    it "renders json with reportData and the numberOfTicks" do
      make_the_request

      expect(response).to render_template json: {reportData: anything, numberTicks: 8}
    end

    it "returns http success" do
      #get 'generate_report'
      #response.should be_success
    end
  end

end
