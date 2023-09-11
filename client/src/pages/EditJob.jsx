import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useLoaderData, useParams } from 'react-router-dom';
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';
import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useQuery } from '@tanstack/react-query';

const singleJobQuery = (id) => ({
    queryKey: ['singleJob', id ],
    queryFn: async () => {
        const { data } = await customFetch(`/jobs/${id}`);
        return data;
    },
});

export const loader = (queryClient) => async ({ params }) => {
    try {
        await queryClient.ensureQueryData(singleJobQuery(params.id));
        return params.id
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        return redirect('/dashboard/all-jobs');
    }
}

export const action = (queryClient) => async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
        await customFetch.patch(`/jobs/${params.id}`, data)
        queryClient.invalidateQueries('jobs')
        toast.success('Job updated successfully');
        return redirect('/dashboard/all-jobs');

    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        return redirect(`/dashboard/edit-job/${params.id}`);
    }
}

const EditJob = () => {
    const id = useLoaderData();
    const { data: { job } } = useQuery(singleJobQuery(id));

    return (
        <Wrapper>
            <Form method='post' className='form'>
                <h4 className='form-title'>Edit Job</h4>
                <div className="form-center">
                    <FormRow type="text" name="position" defaultValue={job.position} />
                    <FormRow type="text" name="company" defaultValue={job.company} />
                    <FormRow type="text" name="jobLocation" defaultValue={job.jobLocation} />
                    <FormRowSelect
                        name="jobStatus"
                        labelText="Job Status"
                        defaultValue={job.jobStatus}
                        list={Object.values(JOB_STATUS)}
                    />
                    <FormRowSelect
                        name="jobType"
                        labelText="Job Type"
                        defaultValue={job.jobType}
                        list={Object.values(JOB_TYPE)}
                    />
                    <SubmitBtn formBtn />
                </div>
            </Form>
        </Wrapper>
    )
}
export default EditJob