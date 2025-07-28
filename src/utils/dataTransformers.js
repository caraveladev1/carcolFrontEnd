export const dataTransformers = {
	groupByExpId(data) {
		const result = {};
		Object.keys(data).forEach((key) => {
			const items = data[key];
			items.forEach((item) => {
				const { exp_id } = item;
				if (!result[exp_id]) {
					result[exp_id] = [];
				}
				result[exp_id].push(item);
			});
		});
		return result;
	},

	mapPendingTaskData(data) {
		return data.map((item) => ({
			...item,
			contract: item.contract_atlas.contract,
			customer: item.contract_atlas.customer,
			price_type: this.getPriceType(item.contract_atlas),
			sample: item.contract_atlas.customer_cupping_state || 'Pending',
			packaging: item.contract_atlas.packaging_type,
			mark: item.contract_atlas.mark,
			shipmentMonth: item.contract_atlas.shipment_date,
			destinationPort: item.contract_atlas.destination_port,
			destinationContainer: item.destination_port,
			weight: item.contract_atlas.estimated_kg,
			production_order: item.contract_atlas.production_order || '-',
			milling_order: item.contract_atlas.milling_order || '-',
			milling_state: item.contract_atlas.milling_state || '-',
			quality: item.contract_atlas.quality,
			origin: item.export_country,
			originPort: item.origin_port,
			units: item.contract_atlas.units,
			secondary_ico_id: item.contract_atlas.secondary_ico,
			process_type: item.contract_atlas.process_type || '-',
		}));
	},

	mapViewContainerData(data) {
		return data.map((item) => ({
			...item,
			contract: item.contract_atlas.contract,
			customer: item.contract_atlas.customer,
			price_type: this.getPriceType(item.contract_atlas),
			sample: item.contract_atlas.customer_cupping_state || 'Pending',
			packaging: item.contract_atlas.packaging_type,
			mark: item.contract_atlas.mark,
			destinationPort: item.contract_atlas.destination_port,
			shipmentMonth: item.contract_atlas.shipment_date,
			weight: item.contract_atlas.estimated_kg,
			date_landing: item.date_landing,
			quality: item.contract_atlas.quality,
			production_order: item.contract_atlas.production_order || '-',
			milling_order: item.contract_atlas.milling_order || '-',
			milling_state: item.contract_atlas.milling_state || '-',
			export_date: item.export_date,
			units: item.contract_atlas.units,
			secondary_ico_id: item.contract_atlas.secondary_ico,
			container_id: item.container_id,
			office: item.export_country,
			destination: item.destination_port,
			originPort: item.origin_port,
			process_type: item.contract_atlas.process_type || '-',
		}));
	},

	mapCreateContainerData(data) {
		return data.map((item) => ({
			ico_id: item.ico,
			secondary_ico_id: item.secondary_ico,
			contract: item.contract,
			mark: item.mark,
			customer: item.customer,
			quality: item.quality,
			packaging_capacity: item.packaging_type,
			units: item.units,
			sample: item.customer_cupping_state === null ? 'Pending' : item.customer_cupping_state,
			shipmentMonth: item.shipment_date,
			price_type: this.getPriceType(item),
			destinationPort: item.destination_port,
			exportCountry: item.origin_iso,
			incoterm: item.incoterm,
			production_order: item.production_order || '-',
			milling_order: item.milling_order || '-',
			milling_state: item.milling_state || '-',
			weight: item.estimated_kg,
			originPort: item.origin_port,
			process_type: item.contract_atlas.process_type || '-',
		}));
	},

	mapEditContainerData(data, selectedIcos) {
		return data.map((entry) => {
			const atlasData = entry.contract_atlas || entry;
			return {
				shipmentMonth: atlasData.shipment_date,
				ico_id: atlasData.ico,
				secondary_ico_id: atlasData.secondary_ico || '-',
				mark: atlasData.mark || '-',
				quality: atlasData.quality || '-',
				packaging_capacity: atlasData.packaging_type || '-',
				units: atlasData.units || '-',
				sample: atlasData.customer_cupping_state || '-',
				destinationPort: atlasData.destination_port || '-',
				price_type: this.getPriceType(atlasData),
				weight: atlasData.estimated_kg || '-',
				select: atlasData.ico,
				originPort: atlasData.origin_port,
				incoterm: atlasData.incoterm,
				production_order: atlasData.production_order || '-',
				milling_order: atlasData.milling_order || '-',
				milling_state: atlasData.milling_state || '-',
				process_type: atlasData.process_type || '-',
			};
		});
	},

	getPriceType(item) {
		if (item.price_type === 'differential' && item.fixed_price_status === null) {
			return 'Differential: Pending ';
		}
		if (item.price_type === 'differential' && item.fixed_price_status !== null) {
			return 'Differential: Fixed ';
		}
		return 'Fixed';
	},

	extractUniqueOptions(data, field) {
		const options = new Set();
		Object.values(data).forEach((group) => {
			if (Array.isArray(group)) {
				group.forEach((item) => {
					if (item[field]) options.add(item[field]);
				});
			}
		});
		return Array.from(options);
	},

	sortGroupsByMinDate(mappedData) {
		// Add minimum date to each group
		Object.keys(mappedData).forEach((exp_id) => {
			const minDateLanding =
				mappedData[exp_id]
					.filter((item) => item.date_landing)
					.map((item) => new Date(item.date_landing).getTime())
					.sort((a, b) => a - b)[0] || null;

			mappedData[exp_id].minDateLanding = minDateLanding;
		});

		// Sort groups by minimum date
		return Object.fromEntries(
			Object.entries(mappedData).sort(([, a], [, b]) => {
				if (a.minDateLanding === null && b.minDateLanding === null) return 0;
				if (a.minDateLanding === null) return 1;
				if (b.minDateLanding === null) return -1;
				return a.minDateLanding - b.minDateLanding;
			}),
		);
	},
};
