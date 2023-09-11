import { FormRow, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { redirect, useOutletContext } from 'react-router-dom';
import { Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';


export const action = (queryClient) => async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('avatar');

    if(file && file.size > 512000) {
        toast.error('File size must be less than 0.5 MB');
        return null;
    }

    try {
        await customFetch.patch('/users/update-user', formData);
        toast.success('Profile updated successfully');
        queryClient.invalidateQueries(['user']);
        return redirect('/dashboard');
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
    }
    return null;
};


const Profile = () => {
    const { user } = useOutletContext();
    const { name, lastName, email, location } = user;


    return (
        <Wrapper>
            <Form method="post" className='form' encType='multipart/form-data'>
                <h4 className='form-title'></h4>
                <div className='from-center'>
                    <div className="form-row">
                        <label htmlFor='avatar' className='form-label'>Avatar</label>
                        Select an image file (max 0.5 MB)
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            accept="image/*"
                            className="form-input"
                        />
                    </div>
                    <FormRow type="text" name="name" defaultValue={name} />
                    <FormRow type="text" name="lastName" defaultValue={lastName} />
                    <FormRow type="email" name="email" defaultValue={email} />
                    <FormRow type="text" name="location" defaultValue={location} />
                    <SubmitBtn formBtn />
                </div>
            </Form>
        </Wrapper>
    )
}
export default Profile