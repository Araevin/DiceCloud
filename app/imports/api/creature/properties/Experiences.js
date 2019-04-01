import SimpleSchema from 'simpl-schema';
import schema from '/imports/api/schema.js';
import PropertySchema from '/imports/api/creature/subSchemas/PropertySchema.js';
import recomputeCreatureXP from '/imports/api/creature/creatureComputation.js';

// Mixins
import recomputeCreatureMixin from '/imports/api/mixins/recomputeCreatureMixin.js';
import creaturePermissionMixin from '/imports/api/mixins/creaturePermissionMixin.js';
import { setDocToLastMixin } from '/imports/api/mixins/setDocToLastMixin.js';
import { setDocAncestryMixin, ensureAncestryContainsCharIdMixin } from '/imports/api/parenting/parenting.js';
import simpleSchemaMixin from '/imports/api/mixins/simpleSchemaMixin.js';
import propagateInheritanceUpdateMixin from '/imports/api/mixins/propagateInheritanceUpdateMixin.js';
import updateSchemaMixin from '/imports/api/mixins/updateSchemaMixin.js';

let Experiences = new Mongo.Collection("experience");

let ExperienceSchema = schema({
	name: {
		type: String,
		optional: true,
	},
	// Potentially long description of the event
	description: {
		type: String,
		optional: true,
	},
	// The amount of XP this experience gives
	value: {
		type: SimpleSchema.Integer,
		defaultValue: 0
	},
	// The real-world date that it occured
	date: {
		type: Date,
		autoValue: function() {
			// If the date isn't set, set it to now on insert
			if (this.isInsert && !this.isSet) {
				return new Date();
			} else if (this.isUpsert && !this.isSet) {
				return {$setOnInsert: new Date()};
			}
		},
	},
	// The date in-world of this event
	worldDate: {
		type: String,
		optional: true,
	},
});

Experiences.attachSchema(PropertySchema);
Experiences.attachSchema(ExperienceSchema);

const insertExperience = new ValidatedMethod({
  name: 'Experiences.methods.insert',
	mixins: [
    creaturePermissionMixin,
    setDocAncestryMixin,
    ensureAncestryContainsCharIdMixin,
		recomputeCreatureMixin,
		setDocToLastMixin,
    simpleSchemaMixin,
  ],
  collection: Experiences,
  permission: 'edit',
  schema: ExperienceSchema,
	skipRecompute(experience){
		return !experience.value;
	},
  run(experience) {
		let result = Experiences.insert(experience);
		if (experience.value){
			recomputeCreatureXP(charId);
		}
		return result;
  },
});

const updateExperience = new ValidatedMethod({
  name: 'Experiences.methods.update',
  mixins: [
		recomputeCreatureMixin,
		propagateInheritanceUpdateMixin,
    updateSchemaMixin,
    creaturePermissionMixin,
  ],
  collection: Experiences,
  permission: 'edit',
  schema: ExperienceSchema,
	skipRecompute({update}){
		return !('value' in update);
	},
  run({_id, update, charId}) {
		let result = Experiences.update(_id, {$set: update});
		if ('value' in update){
			recomputeCreatureXP(charId);
		}
		return result;
  },
});

export default Experiences;
export { ExperienceSchema, insertExperience, updateExperience };
