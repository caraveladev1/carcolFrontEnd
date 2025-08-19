import React, { useState } from 'react';
import { useRolesManagement, MODULE_OPTIONS } from '../Hooks/useRolesManagement.jsx';
import { Loader } from '../components/Loader.jsx';
import { Banner } from '../components/Banner.jsx';

export function ManageRoles() {
	const { roles, loading, error, createRole, updateRoleModules, deleteRole } = useRolesManagement();
	const [newRoleName, setNewRoleName] = useState('');

	if (loading) return <Loader />;
	if (error) return <div className='text-red-500'>{error}</div>;

	const onCreate = async (e) => {
		e.preventDefault();
		const name = newRoleName.trim();
		if (!name) return;
		const res = await createRole(name, []);
		if (res.success) setNewRoleName('');
		else alert(res.error);
	};

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='max-w-[90%] m-auto'>
				<Banner />
				<div className='p-6'>
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-3xl text-beige font-itf uppercase font-bold'>Manage Roles</h1>
					</div>

					{/* Crear rol: solo nombre */}
					<form onSubmit={onCreate} className='bg-black/50 p-4 mb-8 flex gap-4 items-end'>
						<div className='flex-1'>
							<label className='block text-beige mb-1'>Role name</label>
							<input
								value={newRoleName}
								onChange={(e) => setNewRoleName(e.target.value)}
								className='w-full p-3 border border-beige/30 bg-transparent text-beige placeholder:text-beige/50'
								placeholder='e.g. Export, Admin, New User'
							/>
						</div>
						<button type='submit' className='bg-naranja text-cafe px-3 py-3 uppercase font-itf hover:bg-yellow'>
							Create
						</button>
					</form>

					{/* Lista de roles */}
					<div className='space-y-3'>
						{roles.map((role) => (
							<RoleRow
								key={role.id}
								role={role}
								onSave={(mods) => updateRoleModules(role.id, mods)}
								onDelete={() => deleteRole(role.id)}
							/>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

function RoleRow({ role, onSave, onDelete }) {
	const [editing, setEditing] = useState(false);
	const [mods, setMods] = useState(role.modules_access || []);
	const [busy, setBusy] = useState(false);

	const toggleMod = (value) =>
		setMods((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

	const save = async () => {
		setBusy(true);
		const res = await onSave(mods);
		setBusy(false);
		if (!res?.success) return alert(res?.error || 'Failed to save');
		setEditing(false);
	};

	return (
		<div className='bg-black/50 p-4 border border-beige/10'>
			<div className='flex justify-between items-center'>
				{/* Nombre del rol */}
				<div className='flex items-center gap-3'>
					<span className='text-beige font-bold'>{role.name}</span>
					{!editing && (
						<span className='text-beige/50 text-sm font-itf'>
							{mods.length ? `${mods.length} module(s)` : 'No modules'}
						</span>
					)}
				</div>

				{/* Acciones */}
				<div className='flex gap-2'>
					{!editing ? (
						<>
							<button
								onClick={() => setEditing(true)}
								className='border border-yellow text-yellow px-3 py-1 font-itf hover:bg-yellow hover:text-cafe'
							>
								Edit
							</button>
							<button
								onClick={() => {
									if (confirm(`Delete role "${role.name}"?`)) onDelete();
								}}
								className='border border-red-500 font-itf text-red-500 px-3 py-1 hover:bg-red-500 hover:text-white'
							>
								Delete
							</button>
						</>
					) : (
						<>
							<button
								onClick={save}
								disabled={busy}
								className='border border-green-500 text-green-500 px-3 py-1 hover:bg-green-500 hover:text-white disabled:opacity-50'
							>
								{busy ? 'Saving...' : 'Save'}
							</button>
							<button
								onClick={() => {
									setMods(role.modules_access || []);
									setEditing(false);
								}}
								className='border border-beige text-beige px-3 py-1 hover:bg-beige hover:text-cafe'
							>
								Cancel
							</button>
						</>
					)}
				</div>
			</div>

			{/* Panel de edición de módulos */}
			{editing && (
				<div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
					{MODULE_OPTIONS.map((opt) => (
						<label key={opt.value} className='text-beige flex items-center gap-2 font-itf'>
							<input type='checkbox' checked={mods.includes(opt.value)} onChange={() => toggleMod(opt.value)} />
							{opt.label}
						</label>
					))}
				</div>
			)}
		</div>
	);
}
