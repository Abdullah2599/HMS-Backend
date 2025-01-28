const BookingService = require("../service/BookingService");

class BookingController{
    async create(req,res){
        await BookingService.create(req,res);
    }
    async list(req,res){
        await BookingService.list(req,res);
    }
    async bookingRecord(req,res){
        await BookingService.bookingRecord(req,res);
    }
    async bookingRecordofGuest(req,res){
        await BookingService.bookingRecordofGuest(req,res);
    }
    async datefilter(req,res){
        await BookingService.datefilter(req,res);
    }
    async delete(req,res){
    }
    async update(req,res){
    }
}
module.exports=new BookingController;