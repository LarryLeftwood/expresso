import { useState } from "react";
import NavbarDiscover from "../components/NavbarDiscover";
import {
  ErrorMessage,
  Field,
  Formik,
  Form as Furm,
  FormikHelpers,
} from "formik";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPencil } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { AppState, ValuesBlogType } from "../types/types";
import { blogSchema } from "../schemas/schemas";

const API_URL_BLOGS = import.meta.env.VITE_APP_API_URL_BLOGS;

const initialValuesBlog = {
  title: "",
  content: "",
  img: "",
  tags: [],
};

function CreateBlog() {
  const [isModal, setIsModal] = useState(false);
  const token = useSelector((state: AppState) => state.app.user.token);
  const navigate = useNavigate();

  const handleFormSubmit = async (
    values: ValuesBlogType,
    onSubmitProps: FormikHelpers<ValuesBlogType>
  ) => {
    const formData = new FormData();
    formData.append("img", values.img);
    for (const key in values) {
      if (key !== "img") {
        formData.append(key, values[key]);
      }
    }
    try {
      await axios.post(API_URL_BLOGS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsModal(false);
      onSubmitProps.resetForm();
      navigate("/discover");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="xl:w-[85rem] xl:mx-auto">
      <NavbarDiscover />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesBlog}
        validationSchema={blogSchema}
      >
        {({ values, setFieldValue }) => (
          <Furm className="px-6 flex justify-center relative min-h-screen">
            {isModal && (
              <div className="absolute -top-[7rem] bg-black/50 h-screen w-screen flex justify-center items-center">
                <div className="h-[18%] min-h-[210px] w-[31%] bg-white shadow-2xl rounded md:p-8 px-1 pt-8">
                  <h1 className="font-bold text-2xl mb-4">Publish post?</h1>
                  <p className="mb-9">
                    This will publish this post to your blog.
                  </p>
                  <div className="flex items-end justify-end">
                    <button
                      className="font-bold"
                      type="button"
                      onClick={() => setIsModal(false)}
                    >
                      CANCEL
                    </button>
                    <button
                      className="md:ml-8 ml-1 font-bold text-orange-500"
                      type="submit"
                    >
                      CONFIRM
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="w-[75%]">
              <Field
                name="title"
                placeholder="Title"
                type="text"
                className="w-full border-b-2 border-orange-500 mt-2 p-1"
              />
              <ErrorMessage
                className="text-red-500"
                name="title"
                component="div"
              />
              <Dropzone
                multiple={false}
                accept={{ "image/*": [".jpeg", ".png", ".jpg"] }}
                onDrop={(acceptedFiles) => {
                  setFieldValue("img", acceptedFiles[0]);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="border border-slate-300 py-3 px-2 mt-8 mb-8 cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <div className="border border-dashed border-orange-500 py-3 px-2">
                      {!values.img ? (
                        <p>Add Picture Here</p>
                      ) : (
                        <p className="flex justify-between items-center">
                          {values.img.name}
                          <FontAwesomeIcon
                            className="font-bold mr-4"
                            icon={faPencil}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Dropzone>
              <label htmlFor="tags">Tags</label>
              <Field
                id="tags"
                placeholder="Seperate 3 tags by comma"
                name="tags"
                type="text"
                className="w-full border-b-2 border-orange-500 mt-2 p-1"
              />
              <ErrorMessage
                className="text-red-500"
                name="labels"
                component="div"
              />
              <Field
                name="content"
                as="textarea"
                placeholder="Start Writing Your Blog Here"
                className="border border-black mt-8 w-full p-2 h-1/2 min-h-[300px] max-h-[600px] resize-y"
              />
              <ErrorMessage
                className="text-red-500"
                name="content"
                component="div"
              />
              <button
                type="button"
                onClick={() => setIsModal(true)}
                className="w-full bg-orange-500 text-white text-xl p-3 rounded hover:bg-orange-400 transition duration-500"
              >
                <FontAwesomeIcon
                  className="font-bold mr-4"
                  icon={faPaperPlane}
                />
                Publish
              </button>
            </div>
          </Furm>
        )}
      </Formik>
    </div>
  );
}

export default CreateBlog;
