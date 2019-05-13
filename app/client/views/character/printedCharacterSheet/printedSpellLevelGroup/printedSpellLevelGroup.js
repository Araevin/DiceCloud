Template.printedSpellLevelGroup.helpers({
    spellsInGroup: function (spellList, spellLevel, charId) {
        return Spells.find({charId: charId,
            "parent.id": spellList._id, level: spellLevel});
    },
});
