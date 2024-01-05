import { remove, search } from '@orama/orama';

export const deleteIndicesForFiles = async (db, files) => {
	const entriesInEditedFiles = [];
	for (let file of files) {
		const entriesInFile = await searchDBExact(db, 'parent', file);
		entriesInEditedFiles.push(...entriesInFile);
	}
	let deletePromises = [];
	for (let entry of entriesInEditedFiles) {
		deletePromises.push(remove(db, entry.id));
	}
	await Promise.all(deletePromises);
};

/** @param {string}  property*/
/** @param {string}  term*/
export const searchDBExact = async (db, property, term) => {
	const results = await search(db, {
		term,
		properties: [property],
		exact: true,
		limit: 9999
	});
	// log.log("blurry results");
	// log.log(results.hits.map((res) => res.document[property]));
	// orama sometimes doesn't return exact results!! even with exact
	const trueResults = results.hits.filter((result) => {
		return result.document[property] === term;
	});
	console.log('true results', trueResults);
	return trueResults;
};
