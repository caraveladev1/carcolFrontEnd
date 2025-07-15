import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { TableGeneric, Loader, TextInput, SelectInput, SubmitButton, Pagination } from '../components';
import { useUserManagement } from '../Hooks/useUserManagement';
import { Banner } from '../components/Banner';
import { headersTableManageUsers } from '../utils/consts';

export function ManageUsers() {
	const { users, roles, loading, error, createUser, updateUserRole } = useUserManagement();
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [formLoading, setFormLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20; // Número de usuarios por página
	const methods = useForm({ defaultValues: { email: '', roleId: '' } });

	const handleCreateUser = async (data) => {
		if (!data.email || !data.roleId) return;

		setFormLoading(true);
		const result = await createUser(data.email, parseInt(data.roleId));

		if (result.success) {
			methods.reset();
			setShowCreateForm(false);
			setCurrentPage(1); // Resetear a la primera página cuando se añade un usuario
		}
		setFormLoading(false);
	};

	const handleRoleChange = async (userId, newRoleId) => {
		await updateUserRole(userId, parseInt(newRoleId));
	};

	const tableHeaders = headersTableManageUsers;

	// Calcular datos paginados
	const totalUsers = users?.length || 0;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedUsers = users?.slice(startIndex, endIndex) || [];

	const tableData =
		paginatedUsers?.map((user) => ({
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
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<div className='p-6'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-3xl text-beige font-itf uppercase font-bold'>Manage Users</h1>
						<button
							onClick={() => setShowCreateForm(!showCreateForm)}
							className='bg-naranja text-cafe px-4 py-1 uppercase font-itf hover:bg-yellow'
						>
							{showCreateForm ? 'Cancel' : 'Add User'}
						</button>
					</div>

					{error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

					{showCreateForm && (
						<div className='bg-black/50 p-4  mb-6'>
							<h2 className='text-lg font-semibold uppercase text-beige mb-4'>Add New User</h2>
							<FormProvider {...methods}>
								<form onSubmit={methods.handleSubmit(handleCreateUser)} className='flex gap-4 items-end'>
									<div className='flex-1 item-center flex-col'>
										<TextInput
											name='email'
											label='Email'
											placeholder='user@example.com'
											className='border-cafe text-cafe focus:border-cafe'
											rules={{ required: 'Email is required' }}
										/>
									</div>
									<div className='flex-1 item-center flex-col'>
										<SelectInput
											name='roleId'
											label='Role'
											options={roles?.map((role) => ({ value: role.id, label: role.name })) || []}
											rules={{ required: 'Role is required' }}
										/>
									</div>
									<SubmitButton loading={formLoading} buttonText='Add User' loadingText='Adding...' color='naranja' />
								</form>
							</FormProvider>
						</div>
					)}

					<TableGeneric headersTable={tableHeaders} dataTable={tableData} />

					{/* Componente de paginación */}
					<Pagination
						currentPage={currentPage}
						totalItems={totalUsers}
						itemsPerPage={itemsPerPage}
						onPageChange={setCurrentPage}
					/>
				</div>
			</section>
		</div>
	);
}
