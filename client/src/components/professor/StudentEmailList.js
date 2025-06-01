import { useState } from "react";
import { toast } from "react-toastify";
import { FiMail, FiCheck } from "react-icons/fi";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import { sendMail } from "../../services/MailService";
import useAuth from "../../hooks/useAuth";

const StudentEmailList = ({
  activityId,
  activityName,
  students,
  attendancesCount,
  availableDates,
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sending, setSending] = useState(false);
  const axiosCustom = useAxiosCustom();
  const { auth } = useAuth();

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students);
    }
  };

  const handleStudentSelect = (student) => {
    if (selectedStudents.find((s) => s.uuid === student.uuid)) {
      setSelectedStudents(
        selectedStudents.filter((s) => s.uuid !== student.uuid)
      );
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const onSend = async () => {
    try {
      setSending(true);
      const mailData = await sendMail(
        axiosCustom,
        selectedStudents,
        attendancesCount,
        activityName,
        auth?.name,
        auth?.email
      );
      setSelectedStudents([]);
      if (mailData) {
        toast.success("Emails sent successfully!", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Failed to send emails. Please try again later.", {
        position: "top-right",
      });
      console.error(error);
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-wrap justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Students List</h3>
          <button
            type="button"
            disabled={selectedStudents.length === 0 || sending}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2 sm:mt-0"
            onClick={onSend}
          >
            <FiMail className="w-4 h-4 mr-2" />
            {sending ? "Sending..." : `Send Mail (${selectedStudents.length})`}
          </button>
        </div>
        <p className="text-gray-600 mt-1">
          Select students to send emails with their total attendance count.
        </p>
      </div>

      <div className="p-6">
        <div className="border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectedStudents.length === students.length}
                onChange={handleSelectAllStudents}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              ></input>
              <label
                htmlFor="selectAll"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Select all
              </label>
            </div>
            <div className="text-sm text-gray-600">
              {selectedStudents.length} of {students.length} selected
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.uuid}
                className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`student-${student.uuid}`}
                    checked={selectedStudents.some(
                      (s) => s.uuid === student.uuid
                    )}
                    onChange={() => handleStudentSelect(student)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-600">{student.email}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-3">
                    Prezențe: {attendancesCount[student.uuid] || 0}/
                    {availableDates.length || 0}
                  </span>
                  {attendancesCount[student.uuid] === availableDates.length &&
                    availableDates.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheck className="w-3 h-3 mr-1" />
                        Complet
                      </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentEmailList;
