import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { TableGeneric, Loader, TextInput, SelectInput, SubmitButton, Popup, FloatingScrollButton } from '../components';
import { useUserManagement } from '../Hooks/useUserManagement';
import { Banner } from '../components/Banner';
import { headersTableManageUsers } from '../constants/tableHeaders.js';
import { useTranslation } from 'react-i18next';

export function ManageUsers() {
	const { t } = useTranslation();
	const { users, roles, loading, error, createUser, updateUserRole } = useUserManagement();
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', type: 'info' });
	// ...
	const methods = useForm({ defaultValues: { email: '', roleId: '' } });

	const handleCreateUser = async (data) => {
		if (!data.email || !data.roleId) return;

		setFormLoading(true);
		const result = await createUser(data.email, parseInt(data.roleId));

		if (result.success) {
			methods.reset();
			setCurrentPage(1);
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
		await updateUserRole(userId, parseInt(newRoleId));
	};

	const tableHeaders = headersTableManageUsers;

	const tableData =
		users?.map((user) => ({
			username: user.username,
			'role.name': user.role?.name || 'No Role',
			actions: (
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
