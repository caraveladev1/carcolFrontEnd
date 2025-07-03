import React from 'react';
import { Banner } from '../components/Banner';
import { useTranslation } from 'react-i18next';
import { TableGeneric } from '../components/TableGeneric';
import { TABLE_HEADERS } from '../constants';
import { Loader } from '../components/Loader';
import editContainer from '../assets/img/editContainer.webp';
import { Link } from 'react-router-dom';
import { DateInput } from '../components/DateInput';
import { SelectInput } from '../components/SelectInput';
import { TextInput } from '../components/TextInput';
import { FilterContainer } from '../components/FilterContainer';
import commentsButton from '../assets/img/commentsButton.webp';
import { Comments } from '../components/Comments';
import { Announcements } from '../components/Announcements';
import { useRole } from '../Hooks/RoleContext.js';
import { useViewContainers } from '../hooks';

export function ViewContainers() {
	const { t } = useTranslation();
	const role = useRole();
	const {
		organizedData,
		loading,
		officeOptions,
		packagingOptions,
		contractOptions,
		destinationOptions,
		isCommentsOpen,
		selectedIco,
		isAnnouncementsOpen,
		handleCommentsButtonClick,
		handleAnnouncementsButtonClick,
		closeComments,
		closeAnnouncements,
		filteredData,
		setIsAnnouncementsOpen,
		mapDataWithButtons,
		control,
	} = useViewContainers();
	if (loading) {
		return <Loader />;
	}

	const filteredDataResult = filteredData();

	return (
		<div className='bg-dark-background bg-cover bg-fixed min-h-screen'>
			<section className='homeContainer max-w-[90%] m-auto pb-5'>
				<Banner />
				<h1 className='text-5xl font-bold my-8 uppercase text-yellow font-bayard'>{t('viewContainers')}</h1>

				<FilterContainer columns={7}>
					<DateInput name='initialDate' control={control} />
					<DateInput name='finalDate' control={control} />
					<SelectInput name='office' control={control} options={officeOptions} isMulti={true} />
					<SelectInput name='packaging' control={control} options={packagingOptions} isMulti={true} />
					<SelectInput name='contract' control={control} options={contractOptions} isMulti={true} />
					<SelectInput name='destination' control={control} options={destinationOptions} isMulti={true} />
					<TextInput name='ico' control={control} placeholder={t('ico_id')} />
					{role === 'Admin' && (
						<button
							className='bg-pink font-bayard text-xl uppercase border-2 border-pink p-4 w-full h-full  text-white focus:outline-none focus:border-2 focus:border-pink text-start'
							type='button'
							value='Manage Announcements'
							onClick={() => setIsAnnouncementsOpen(true)}
						>
							Edit Announcements
						</button>
					)}
				</FilterContainer>

				{filteredDataResult &&
					Object.keys(filteredDataResult).map((exp_id) => {
						const dataWithButtons = mapDataWithButtons(filteredDataResult[exp_id], role);
						const totalWeight = dataWithButtons.reduce((sum, item) => {
							const weight = parseFloat(item.weight) || 0;
							return sum + weight;
						}, 0);

						return (
							<div key={exp_id} className='my-4 gap-6'>
								<div className='titleContainer flex flex-row justify-between gap-10 items-center'>
									<div className='flex flex-row justify-between items-center gap-6'>
										<h2 className='text-3xl font-bold text-white font-bayard uppercase'>{exp_id}</h2>
										{role === 'Admin' && (
											<Link to={`/edit-container/${dataWithButtons[0].container_id}`}>
												<img className='max-w-[50%]' src={editContainer} alt='Edit Container' />
											</Link>
										)}
									</div>
									<div className='containerData flex flex-row gap-4'>
										<p className='text-xl font-bold text-pink font-bayard uppercase'>{`Total Weight (kg): ${totalWeight || 'No available'}`}</p>
										<p className='text-xl font-bold text-pink font-bayard uppercase'>{`Booking: ${dataWithButtons[0]?.booking || 'No available'}`}</p>
										<p className='text-xl font-bold text-celeste font-bayard uppercase'>{`Loading to Port: ${dataWithButtons[0]?.date_landing || 'No available'}`}</p>
									</div>
								</div>
								<div className='my-4'>
									<TableGeneric
										headersTable={TABLE_HEADERS.VIEW}
										dataTable={dataWithButtons}
										renderRowContent={(row) => row}
									/>
								</div>
							</div>
						);
					})}

				{isCommentsOpen && <Comments ico={selectedIco} onClose={closeComments} />}
				{isAnnouncementsOpen && <Announcements ico={selectedIco} onClose={closeAnnouncements} />}
			</section>
		</div>
	);
}
