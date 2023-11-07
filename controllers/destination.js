const { verifyToken } = require("../middlewares/auth");
const Destination = require("../models/Destination");
const User = require("../models/User");


const getAllDestination = async (req, res, next) => {
    const destinations = await Destination.find({}).sort({ createdAt: -1 });
    return res.status(200).json(
        destinations
    )
}

const addDestination = async (req, res, next) => {
    const tokenToSplit = req.header('token');
    if(!tokenToSplit) return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập để thực hiện thao tác này",
    })
    const token = req.header('token').split(' ')[1];
    const payload = await verifyToken(token);
    const {username, role} = payload.sub;
    const admin = await User.findOne({username, role});
    if(admin && admin.role == 'admin'){
        const {placeName, latitude, longitude, address} = req.body;
        const destination = new Destination({placeName, latitude, longitude, address});
        await destination.save();
        return res.status(201).json({
            success: true,
            message: "Thêm địa điểm thành công",
        })
    }
    return res.status(403).json({
        success: false,
        message: "Bạn không phải là quản trị viên, không thể thực hiện thêm địa điểm",
    })
}

const updateDestination = async (req, res, next) => {
    const tokenToSplit = req.header('token');
    if(!tokenToSplit) return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập để thực hiện thao tác này",
    })
    const token = req.header('token').split(' ')[1];
    const payload = await verifyToken(token);
    const {username, role} = payload.sub;
    const admin = await User.findOne({username, role});
    if(admin && admin.role == 'admin'){
        const {destinationID, placeName, longitude, latitude, address} = req.body;
        const destination = await Destination.findByIdAndUpdate(destinationID, {placeName: placeName, latitude: latitude, longitude: longitude, address: address});
        return res.status(200).json({
            success: true,
            message: "Cập nhật địa điểm thành công"
        })
    }
    return res.status(200).json({
        success: true,
        message: "Bạn không phải người quản trị, không thể thực hiện điều chỉnh địa điểm"
    })
}

const getDestinationByID = async (req, res, next) => {
    /** Lấy destinationID từ app truyền lên param */
    const {destinationID} = req.params;
    /** Tìm địa điểm trong cơ sở dữ liệu bằng id */
    const destination = await Destination.findById(destinationID);
    /** Nếu tìm thấy thì trả về địa điểm đó */
    if(destination){
        return res.status(200).json({
            success: true,
            destination
        })
    }
    /** Ngược lại thì trả về thông báo không tìm thấy */
    return res.status(404).json({
        success: false,
        message: "Không tìm thấy địa điểm này"
    })
}

const deleteDestination = async (req, res, next) => {
    const tokenToSplit = req.header('token');
    if(!tokenToSplit) return res.status(401).json({
        success: false,
        message: "Bạn cần đăng nhập để thực hiện thao tác này",
    })
    const token = req.header('token').split(' ')[1];
    const payload = await verifyToken(token);
    const {username, role} = payload.sub;
    const admin = await User.findOne({username, role});
    if(admin && admin.role == 'admin'){
        const {destinationID} = req.params;
        const destination = await Destination.findById(destinationID);
        await destination.save();
        return res.status(200).json({
            success: true,
            message: "Xóa địa điểm thành công",
        })
    }
    return res.status(403).json({
        success: false,
        message: "Bạn không phải là quản trị viên, không thể thực hiện xóa địa điểm",
    })
}

module.exports = {
    getAllDestination,
    addDestination,
    getDestinationByID,
    updateDestination,
    deleteDestination
}