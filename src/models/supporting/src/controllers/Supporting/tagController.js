import TagModel from "../models/TagModel.js";

// Lấy danh sách tất cả tag
export const getAllTags = async (req, res) => {
  try {
    const tags = await TagModel.find();
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới tag
export const createTag = async (req, res) => {
  try {
    const { name, color } = req.body;
    const newTag = new TagModel({ name, color });
    await newTag.save();
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy 1 tag theo ID
export const getTagById = async (req, res) => {
  try {
    const tag = await TagModel.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật tag (PATCH)
export const updateTag = async (req, res) => {
  try {
    const updatedTag = await TagModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa tag
export const deleteTag = async (req, res) => {
  try {
    const deletedTag = await TagModel.findByIdAndDelete(req.params.id);
    if (!deletedTag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
