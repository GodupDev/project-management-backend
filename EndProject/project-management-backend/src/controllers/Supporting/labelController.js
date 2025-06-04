import LabelModel from "../../models/supporting/label.model.js";

// 📌 Tạo label mới
export const createLabel = async (req, res) => {
  try {
    const { name, color } = req.body;

    const newLabel = new LabelModel({ name, color });
    await newLabel.save();

    res.status(201).json({
      message: "Tạo label thành công.",
      data: newLabel,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo label.",
      error: error.message,
    });
  }
};

// 📌 Lấy tất cả labels
export const getAllLabels = async (req, res) => {
  try {
    const labels = await LabelModel.find().sort({ createdAt: -1 });
    res.status(200).json(labels);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách labels.",
      error: error.message,
    });
  }
};

// 📌 Lấy chi tiết label theo id
export const getLabelById = async (req, res) => {
  try {
    const { id } = req.params;
    const label = await LabelModel.findById(id);

    if (!label) {
      return res.status(404).json({ message: "Không tìm thấy label." });
    }

    res.status(200).json(label);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy label.",
      error: error.message,
    });
  }
};

// 📌 Cập nhật label
export const updateLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const updatedLabel = await LabelModel.findByIdAndUpdate(
      id,
      { name, color },
      { new: true, runValidators: true }
    );

    if (!updatedLabel) {
      return res.status(404).json({ message: "Không tìm thấy label." });
    }

    res.status(200).json({
      message: "Cập nhật label thành công.",
      data: updatedLabel,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật label.",
      error: error.message,
    });
  }
};

// 📌 Xóa label
export const deleteLabel = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLabel = await LabelModel.findByIdAndDelete(id);

    if (!deletedLabel) {
      return res.status(404).json({ message: "Không tìm thấy label." });
    }

    res.status(200).json({
      message: "Xóa label thành công.",
      data: deletedLabel,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa label.",
      error: error.message,
    });
  }
};
