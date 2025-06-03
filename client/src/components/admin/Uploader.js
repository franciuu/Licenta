import { useEffect } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

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
      maxFileSize="5MB"
      acceptedFileTypes={["image/jpeg", "image/jpg"]}
      labelFileTypeNotAllowed="Only JPG/JPEG files are allowed"
      labelMaxFileSize="The maximum allowed size is 5MB"
    />
  );
};

export default Uploader;
