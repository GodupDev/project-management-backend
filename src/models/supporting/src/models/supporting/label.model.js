import mongoose from "mongoose";
import Collection from "../../config/collection.js";
import { Enums } from "../../config/enum.js";

const labelSchema = new mongoose.Schema(
  {
    // name có thể là 1 trong các PriorityLabel enum hoặc custom text
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Cho phép nếu value nằm trong enum PriorityLabel hoặc là chuỗi bất kỳ do user đặt
          const allowedValues = Object.values(Enums.PriorityLabel);
          return value && (allowedValues.includes(value) || value.length > 0);
        },
        // Thông báo lỗi nếu không hợp lệ
        message: "Tên label không hợp lệ.",
      },
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const LabelModel = mongoose.model(Collection.supporting.LABEL, labelSchema);
export default LabelModel;
