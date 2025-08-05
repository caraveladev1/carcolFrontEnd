import React from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { TABLE_HEADERS } from '../constants';
import { formatHeader } from '../utils/formatHeader';
import { Loader } from '../components/Loader';
import editContainer from '../assets/img/editContainer.webp';
import { Link } from 'react-router-dom';
import { DateInput } from '../components/DateInput';
import { SelectInput } from '../components/SelectInput';
import { TextInput } from '../components/TextInput';
import { FilterSidebar } from '../components/FilterSidebar';
import { Comments } from '../components/Comments';
import { WeightsTooltip } from '../components/WeightsTooltip';
import { useViewContainers } from '../Hooks';
import { PermissionGuard } from '../components/PermissionGuard.jsx';
import { FloatingScrollButton, ContainerReorderPopup } from '../components/general';

export function ViewContainers() {
	const { t } = useTranslation();
	const {
		loading,
		officeOptions,
		packagingOptions,
		contractOptions,
		destinationOptions,
		millingStateOptions,
		isCommentsOpen,
		selectedIco,
		closeComments,
		filteredData,
		mapDataWithButtons,
		control,
		resetFilters,
		weightsTooltipVisible,
		calculateWeightsData,
		hideWeightsTooltip,
		toggleWeightsTooltip,
		refreshNotifications,
		selectedHeaders,
		setValue,
		isReorderPopupOpen,
		openReorderPopup,
		closeReorderPopup,
		handleReorderSave,
		containersForReorder,
	} = useViewContainers();

	const [isFilterSidebarOpen, setIsFilterSidebarOpen] = React.useState(false);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			{!isFilterSidebarOpen && <FloatingScrollButton />}
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<div className='flex justify-between items-center my-8'>
					<h1 className='text-3xl font-bold uppercase text-yellow font-itf'>{t('viewContainers')}</h1>
					<PermissionGuard permissions={['containers.edit']}>
						<button
							onClick={openReorderPopup}
							className='bg-naranja text-beige font-itf text-lg px-6 py-3 transition-colors duration-200 '
						>
							{t('reorderContainers')}
						</button>
					</PermissionGuard>
				</div>

				<FilterSidebar title='filters' onSidebarOpen={setIsFilterSidebarOpen}>
					<DateInput name='initialDate' control={control} />
					<DateInput name='finalDate' control={control} />
					<SelectInput name='office' control={control} options={officeOptions} isMulti={true} />
					<SelectInput name='packaging' control={control} options={packagingOptions} isMulti={true} />
					<SelectInput name='contract' control={control} options={contractOptions} isMulti={true} />
					<SelectInput name='destination' control={control} options={destinationOptions} isMulti={true} />
					{/* Filtro de Milling State */}
					<SelectInput
						name='milling_state'
						control={control}
						options={millingStateOptions.map((opt) => ({ ...opt, label: formatHeader(opt.value) }))}
						isMulti={true}
						placeholder={t('Select Milling State')}
					/>
					<TextInput name='ico' control={control} placeholder={t('ico_id')} />
					{/* Filtro de columnas */}
					<SelectInput
						name='selectedHeaders'
						control={control}
						options={TABLE_HEADERS.VIEW.map((header) => ({ value: header, label: formatHeader(header) }))}
						isMulti={true}
						placeholder={t('Selecciona columnas')}
					/>
					<button
						type='button'
						onClick={resetFilters}
						className='bg-naranja hover:bg-red-600 text-white font-itf text-lg uppercase p-4 w-full h-full min-h-[60px] transition-colors duration-200'
					>
						{t('resetFilters')}
					</button>
				</FilterSidebar>

				{/* Pagination removed: show all filteredData */}
				{Object.entries(typeof filteredData === 'function' ? filteredData() : filteredData || {}).map(
					([exp_id, containerData]) => {
						const dataWithButtons = mapDataWithButtons(containerData);
						const totalWeight = dataWithButtons.reduce((sum, item) => {
							const weight = parseFloat(item.weight) || 0;
							return sum + weight;
						}, 0);

						const weightsData = calculateWeightsData(dataWithButtons);

						return (
							<div key={exp_id} className='my-4 gap-6'>
								<div className='titleContainer flex flex-row justify-between gap-10 items-center'>
									<div className='flex flex-row justify-between items-center gap-6'>
										<h2 className='text-2xl font-bold text-white font-itf uppercase'>{exp_id}</h2>
										<PermissionGuard permissions={['containers.edit']}>
											<Link to={`/edit-container/${dataWithButtons[0].container_id}`}>
												<img className='max-w-[50%]' src={editContainer} alt='Edit Container' />
											</Link>
										</PermissionGuard>
									</div>
									<div className='containerData flex flex-row gap-4 items-center'>
										<p className='text-lg font-bold text-morado font-itf uppercase'>{`ETD: ${dataWithButtons[0]?.export_date || 'No available'}`}</p>
										<p className='text-lg font-bold text-pink font-itf uppercase'>{`Booking: ${dataWithButtons[0]?.booking || 'No available'}`}</p>
										<p className='text-lg font-bold text-celeste font-itf uppercase'>{`Origin Port: ${dataWithButtons[0]?.origin_port || 'No available'}`}</p>
										<p
											className={`text-lg font-bold font-itf uppercase ${dataWithButtons[0]?.date_landing_color}`}
										>{`Loading to Port: ${dataWithButtons[0]?.date_landing || 'No available'}`}</p>
										<div className='relative' onClick={() => toggleWeightsTooltip(exp_id)}>
											<button className='text-lg font-bold text-cafe font-itf uppercase cursor-pointer hover:text-pink-400 transition-colors duration-200 bg-beige px-2 py-1'>
												{t('weightDetails')}
											</button>
											<WeightsTooltip
												isVisible={weightsTooltipVisible[exp_id] || false}
												weightsData={weightsData}
												position='top'
												onClose={() => hideWeightsTooltip(exp_id)}
											/>
										</div>
									</div>
								</div>
								<div className='my-4'>
									<TableGeneric
										headersTable={selectedHeaders}
										dataTable={dataWithButtons}
										renderRowContent={(row) => row}
									/>
								</div>
							</div>
						);
					},
				)}

				{/* Pagination removed */}

				{isCommentsOpen && <Comments ico={selectedIco} onClose={closeComments} onCommentAdded={refreshNotifications} />}

				{/* Container Reorder Popup */}
				<ContainerReorderPopup
					containers={containersForReorder}
					isOpen={isReorderPopupOpen}
					onClose={closeReorderPopup}
					onSave={handleReorderSave}
				/>
			</section>
		</div>
	);
}
