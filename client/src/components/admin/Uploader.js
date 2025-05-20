import { useEffect } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

const Uploader = ({ files, setFiles, initialUrls }) => {
  useEffect(() => {
    if (initialUrls?.length > 0) {
      const prepared = initialUrls.map((url) => ({
        source: url,
        options: {
          type: "local",
        },
      }));
      setFiles(prepared);
      console.log(prepared);
    }
  }, [initialUrls]);

  return (
    <FilePond
      files={files}
      server={{
        load: (source, load, error, progress, abort, headers) => {
          fetch(source)
            .then((res) => res.blob())
            .then(load)
            .catch(error);
        },
      }}
      onupdatefiles={setFiles}
      allowMultiple={true}
      required={true}
      credits={false}
      maxFiles={10}
      acceptedFileTypes={["image/*"]}
      labelFileTypeNotAllowed="Doar imagini sunt permise"
      labelIdle="Drag & Drop or Search"
    />
  );
};

export default Uploader;
