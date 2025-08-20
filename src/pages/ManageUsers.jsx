import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { TableGeneric, Loader, TextInput, SelectInput, SubmitButton, Popup, FloatingScrollButton } from '../components';
import { useUserManagement } from '../Hooks/useUserManagement';
import { Banner } from '../components/Banner';
import { headersTableManageUsers } from '../constants/tableHeaders.js';
import { useTranslation } from 'react-i18next';
import { OptionsPopup } from '../components/general/OptionsPopup.jsx';

export function ManageUsers() {
	const { t } = useTranslation();
	const { users, roles, loading, error, createUser, updateUserRole, deleteUser } = useUserManagement();
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', type: 'info' });
	const [confirmState, setConfirmState] = useState({ open: false, userId: null, username: '' });
	// ...
	const methods = useForm({ defaultValues: { email: '', roleId: '' } });

	const handleCreateUser = async (data) => {
		if (!data.email || !data.roleId) return;

		setFormLoading(true);
		const result = await createUser(data.email, parseInt(data.roleId));

		if (result.success) {
			methods.reset();
			setPopup({ isOpen: true, title: 'success', message: 'User created successfully!', type: 'success' });
		} else {
			setPopup({ isOpen: true, title: 'error', message: 'Failed to create user. Please try again.', type: 'error' });
		}
		setFormLoading(false);
	};
	const closePopup = () => {
		setPopup({ isOpen: false, title: '', message: '', type: 'info' });
	};

	const handleRoleChange = async (userId, newRoleId) => {
		const res = await updateUserRole(userId, parseInt(newRoleId));
		if (!res?.success) {
			setPopup({ isOpen: true, title: 'error', message: 'Failed to update user role', type: 'error' });
		} else {
			setPopup({ isOpen: true, title: 'success', message: 'User role updated', type: 'success' });
		}
	};

	const tableHeaders = headersTableManageUsers;

	const tableData =
		users?.map((user) => ({
			username: user.username,
			'role.name': user.role?.name || 'No Role',
			actions: (
				<div className='flex gap-2 items-center'>
					<select
						value={user.role?.id || ''}
						onChange={(e) => handleRoleChange(user.id, e.target.value)}
						className='text-sm p-1 border border-cafe text-cafe'
					>
						{roles?.map((role) => (
							<option key={role.id} value={role.id}>
								{role.name}
							</option>
						)) || []}
					</select>
					<button
						onClick={() => setConfirmState({ open: true, userId: user.id, username: user.username })}
						className='text-red-500 border border-red-500 px-2 py-1 hover:bg-red-500 hover:text-white text-sm'
					>
						Delete
					</button>
				</div>
			),
		})) || [];

	if (loading) return <Loader />;

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<FloatingScrollButton />
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<div className='p-6'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-3xl text-beige font-itf uppercase font-bold'>Manage Users</h1>
						<button
							onClick={() => setShowCreateForm(!showCreateForm)}
							className='bg-naranja text-cafe px-4 py-1 uppercase font-itf hover:bg-yellow'
						>
							{showCreateForm ? t('Cancel') : t('Add User')}
						</button>
					</div>

					<Popup
						isOpen={popup.isOpen}
						onClose={closePopup}
						title={popup.title ? t(popup.title) : ''}
						message={popup.message ? t(popup.message) : ''}
						type={popup.type}
					/>

					<OptionsPopup
						isOpen={confirmState.open}
						title='Delete user'
						message={`Delete user ${confirmState.username}?`}
						confirmText='Delete'
						cancelText='Cancel'
						onConfirm={async () => {
							const id = confirmState.userId;
							setConfirmState({ open: false, userId: null, username: '' });
							const res = await deleteUser(id);
							if (!res?.success) {
								setPopup({ isOpen: true, title: 'error', message: 'Failed to delete user', type: 'error' });
							} else {
								setPopup({ isOpen: true, title: 'success', message: 'User deleted', type: 'success' });
							}
						}}
						onCancel={() => setConfirmState({ open: false, userId: null, username: '' })}
						type='warning'
					/>

					{showCreateForm && (
						<div className='bg-black/50 p-4  mb-6'>
							<h2 className='text-lg font-itf font-semibold uppercase text-beige mb-4'>{t('Add New User')}</h2>
							<FormProvider {...methods}>
								<form onSubmit={methods.handleSubmit(handleCreateUser)} className='flex gap-4 items-end'>
									<div className='flex-1 item-center flex-col'>
										<TextInput
											name='email'
											label={t('Email')}
											placeholder='user@caravela.coffee'
											rules={{ required: t('Email is required') }}
										/>
									</div>
									<div className='flex-1 item-center flex-col'>
										<SelectInput
											name='roleId'
											label={t('Role')}
											options={roles?.map((role) => ({ value: role.id, label: role.name })) || []}
											rules={{ required: t('Role is required') }}
										/>
									</div>
									<SubmitButton
										loading={formLoading}
										buttonText={t('Add User')}
										loadingText={t('Adding...')}
										color='naranja'
									/>
								</form>
							</FormProvider>
						</div>
					)}

					<TableGeneric headersTable={tableHeaders} dataTable={tableData} />

					{/* Pagination removed */}
				</div>
			</section>
		</div>
	);
}
